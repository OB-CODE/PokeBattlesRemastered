import { useState, useCallback } from 'react';

/**
 * Custom hook to manage tooltip visibility.
 * @returns An object containing visibility state and event handlers.
 */
const useTooltipVisibility = () => {
    const [isVisible, setIsVisible] = useState(false);

    const showTooltip = useCallback(() => {
        setIsVisible(true);
    }, []);

    const hideTooltip = useCallback(() => {
        setIsVisible(false);
    }, []);

    return {
        isVisible,
        showTooltip,
        hideTooltip,
    };
};

export default useTooltipVisibility;