// Type definitions for Chart.js
declare namespace Chart {
    interface ChartConfiguration {
        type: string;
        data: ChartData;
        options?: ChartOptions;
    }

    interface ChartData {
        labels?: string[];
        datasets: ChartDataset[];
    }

    interface ChartDataset {
        label?: string;
        data: number[];
        borderColor?: string;
        backgroundColor?: string;
        tension?: number;
        fill?: boolean;
    }

    interface ChartOptions {
        responsive?: boolean;
        maintainAspectRatio?: boolean;
        scales?: {
            y?: {
                beginAtZero?: boolean;
                title?: {
                    display?: boolean;
                    text?: string;
                }
            };
            x?: {
                title?: {
                    display?: boolean;
                    text?: string;
                }
            }
        };
        plugins?: {
            title?: {
                display?: boolean;
                text?: string;
            };
            tooltip?: {
                mode?: string;
                intersect?: boolean;
            }
        };
    }

    class Chart {
        constructor(ctx: HTMLCanvasElement, config: ChartConfiguration);
        destroy(): void;
    }
}

declare interface Window {
    Chart: typeof Chart.Chart;
}
