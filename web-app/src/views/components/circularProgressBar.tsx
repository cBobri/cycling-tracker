import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CircularProgressBarProps {
    value: number;
    text?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ value }) => {
    const getPathColor = (value: number): string => {
        const startColor = { r: 235, g: 96, b: 9 }; // #eb6009
        const endColor = { r: 24, g: 235, b: 9 }; // #18eb09

        const interpolate = (
            start: number,
            end: number,
            factor: number
        ): number => {
            return Math.round(start + (end - start) * factor);
        };

        const r = interpolate(startColor.r, endColor.r, value);
        const g = interpolate(startColor.g, endColor.g, value);
        const b = interpolate(startColor.b, endColor.b, value);

        const toHex = (component: number): string => {
            const hex = component.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    return (
        <div className="w-[full] h-[full] font-robotoCondensed text-darkLight-200 font-semibold">
            <CircularProgressbar
                value={value}
                maxValue={1}
                text={`${(value * 100).toFixed(1)}%`}
                styles={buildStyles({
                    pathColor: getPathColor(value),
                    textColor: getPathColor(value),
                    trailColor: "#29434d",
                })}
            />
        </div>
    );
};

export default CircularProgressBar;
