import React from 'react';
import { cn } from '../../utils/cn'; // I need to create this utils file or import from Button/Input where I defined it locally.
// Better to move `cn` to a utils file now.

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-dark-border/50", className)}
            {...props}
        />
    );
};
