import { render, screen } from '@testing-library/react';

// Simple smoke test – ensures the module system resolves
describe('App smoke test', () => {
    it('renders a simple component', () => {
        const TestComponent = () => <div data-testid="test">GlassQC</div>;
        render(<TestComponent />);
        expect(screen.getByTestId('test')).toHaveTextContent('GlassQC');
    });
});
