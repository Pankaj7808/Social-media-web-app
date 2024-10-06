import React from 'react';

function PassStrengthIndicator({ strength }) {
    const parent = {
        display: "flex",
        gap: "5px",
    };

    const child = {
        height: "5px",
        borderRadius: "5px",
        flex: 1, // Ensure children take equal space
    };

    // Define colors for different strength levels
    const getColor = (level) => {
        switch (level) {
            case 1:
                return "red"; // Weak
            case 2:
                return "orange"; // Moderate
            case 3:
                return "green"; // Strong
            default:
                return "lightgray"; // Default (No password)
        }
    };

    // Create an array of strength indicators
    const strengthIndicators = [1, 2, 3].map((level) => (
        <div
            key={level}
            style={{
                ...child,
                backgroundColor: strength >= level ? getColor(level) : "lightgray",
                opacity: strength >= level ? 1 : 0.5,
            }}
        />
    ));

    return <div style={parent}>{strengthIndicators}</div>;
}

export default PassStrengthIndicator;
