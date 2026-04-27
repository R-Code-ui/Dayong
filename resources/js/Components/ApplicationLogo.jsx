import React from 'react';

export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/logoDayong.png"
            alt="Dayong Management System Logo"
            // We force a height and keep width auto to prevent squishing
            // 'h-20' is usually a good size for login screens
            className={`h-20 w-auto object-contain ${props.className}`}
        />
    );
}
