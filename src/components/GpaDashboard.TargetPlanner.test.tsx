import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';
import GpaDashboard from './GpaDashboard';
import { API_BASE_URL } from '../api/ApiConfig'; 

globalThis.fetch = vi.fn();

describe('GpaDashboard - Target Planner Integration', () => {
    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('successfully chains both API calls and displays the target result', async () => {
        const mockGpaResponse = {
            calculatedGpa: 3.5,
            totalCreditHours: 60,
            message: "Good standing"
        };

        const mockTargetResponse = {
            requiredGpa: 3.8,
            message: "You need a 3.8 in your future courses to hit your target!"
        };

        const fetchMock = globalThis.fetch as any;
        fetchMock
            .mockResolvedValueOnce({ ok: true, json: async () => mockGpaResponse })
            .mockResolvedValueOnce({ ok: true, json: async () => mockTargetResponse });

        render(<GpaDashboard />);

        fireEvent.click(screen.getByText('+ Add target/desired GPA'));

        const targetGpaInput = screen.getByLabelText(/Target GPA/i); 
        const futureCreditsInput = screen.getByLabelText(/Future Credit Hours/i); 

        fireEvent.change(targetGpaInput, { target: { value: '3.7' } });
        fireEvent.change(futureCreditsInput, { target: { value: '15' } });

        fireEvent.click(screen.getByRole('button', { name: /Calculate GPA/i }));

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(2);

            expect(globalThis.fetch).toHaveBeenNthCalledWith(
                1,
                `${API_BASE_URL}/calculate-gpa`,
                expect.objectContaining({ method: 'POST' })
            );

            expect(globalThis.fetch).toHaveBeenNthCalledWith(
                2,
                `${API_BASE_URL}/calculate-target`,
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('"targetGpa":3.7')
                })
            );

            expect(screen.getByText('You need a 3.8 in your future courses to hit your target!')).toBeInTheDocument();
        });
    });

    it('handles the target calculation safely if future credits are missing', async () => {
        (globalThis.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ calculatedGpa: 3.0, totalCreditHours: 30 })
        });

        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

        render(<GpaDashboard />);

        fireEvent.click(screen.getByText('+ Add target/desired GPA'));
        
        const targetGpaInput = screen.getByLabelText(/Target GPA/i); 
        fireEvent.change(targetGpaInput, { target: { value: '3.5' } });

        fireEvent.click(screen.getByRole('button', { name: /Calculate GPA/i }));

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled(); 
        });

        alertMock.mockRestore();
    });
});