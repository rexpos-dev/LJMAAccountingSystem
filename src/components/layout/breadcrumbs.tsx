"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    return (
        <nav className="flex items-center text-sm text-muted-foreground">
            <Link href="/dashboard" className="flex items-center hover:text-foreground transition-colors">
                <Home className="w-4 h-4 mr-1" />
                <span className="sr-only">Home</span>
            </Link>
            {segments.length > 0 && <ChevronRight className="w-4 h-4 mx-2" />}

            {segments.map((segment, index) => {
                const path = `/${segments.slice(0, index + 1).join('/')}`;
                const isLast = index === segments.length - 1;
                const formattedSegment = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                return (
                    <Fragment key={path}>
                        {isLast ? (
                            <span className="font-medium text-foreground">{formattedSegment}</span>
                        ) : (
                            <Link href={path} className="hover:text-foreground transition-colors">
                                {formattedSegment}
                            </Link>
                        )}
                        {!isLast && <ChevronRight className="w-4 h-4 mx-2" />}
                    </Fragment>
                );
            })}
        </nav>
    );
}
