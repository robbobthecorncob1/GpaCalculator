import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';
import GpaDashboard from './GpaDashboard';
import { API_BASE_URL } from '../api/ApiConfig';

globalThis.fetch = vi.fn();

describe('GpaDashboard', () => {
    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the main heading', () => {
        render(<GpaDashboard />);
        const heading = screen.getByRole('heading', { level: 1, name: /GPA Calculator/i });
        expect(heading).toBeInTheDocument();
    });

    it('calculates standard GPA and displays the result from the API', async () => {
        const mockApiResponse = {
            calculatedGpa: 3.85,
            totalCreditHours: 15,
            message: "Excellent work!"
        };

        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockApiResponse,
        });

        render(<GpaDashboard />);

        const calculateBtn = screen.getByRole('button', { name: /Calculate GPA/i });
        fireEvent.click(calculateBtn);

        expect(screen.getByText('Calculating...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Your GPA: 3.85')).toBeInTheDocument();
            expect(screen.getByText('Excellent work!')).toBeInTheDocument();
        });

        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            `${API_BASE_URL}/calculate-gpa`,
            expect.objectContaining({
                method: "POST",
                headers: { "Content-Type": "application/json" }
            })
        );
    });
});