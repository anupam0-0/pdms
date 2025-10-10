export function formatCurrency(amount: number, currency = "INR") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

// Examples:
// formatCurrency(1234.56) // "₹1,234.56"
// formatCurrency(1234.56, "USD") // "$1,234.56"
// formatCurrency(5000, "EUR") // "€5,000.00"
