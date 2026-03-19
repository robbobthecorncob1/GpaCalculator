import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import GpaDashboard from './GpaDashboard';

describe('GpaDashboard - Course List Management', () => {
    
    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    beforeEach(() => {
        render(<GpaDashboard />);
    });

    it('adds a new empty course row when "+ Add Another Class" is clicked', () => {
        const initialCourses = screen.getAllByPlaceholderText(/Class Name/i);
        expect(initialCourses.length).toBe(1);

        const addButton = screen.getByRole('button', { name: /\+ Add Another Class/i });
        fireEvent.click(addButton);

        const updatedCourses = screen.getAllByPlaceholderText(/Class Name/i);
        expect(updatedCourses.length).toBe(2);
    });

    it('updates course information when the user types in the inputs', () => {
        const courseNameInput = screen.getByPlaceholderText(/Class Name/i);
        const creditInput = screen.getByRole('spinbutton'); 

        fireEvent.change(courseNameInput, { target: { value: 'Physics 101' } });
        fireEvent.change(creditInput, { target: { value: '4' } });

        expect(courseNameInput).toHaveValue('Physics 101');
        expect(creditInput).toHaveValue(4);
    });

    it('removes a specific course when the remove button is clicked', () => {
        const addButton = screen.getByRole('button', { name: /\+ Add Another Class/i });
        fireEvent.click(addButton);

        let courseInputs = screen.getAllByPlaceholderText(/Class Name/i);
        expect(courseInputs.length).toBe(2);

        const removeButtons = screen.getAllByRole('button', { name: /X/i });
        
        fireEvent.click(removeButtons[0]);

        courseInputs = screen.getAllByPlaceholderText(/Class Name/i);
        expect(courseInputs.length).toBe(1);
    });
});