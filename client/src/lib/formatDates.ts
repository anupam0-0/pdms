export function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString();
}

// Example usages:
// formatDate("2024-06-01")           // e.g., "6/1/2024"
// formatDate(new Date())             // e.g., "6/11/2024"
// formatDate("December 17, 1995")    // e.g., "12/17/1995"
