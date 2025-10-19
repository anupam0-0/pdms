
// ? Concatenates a list of class names into a single string, filtering out any falsy values.

export function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(" ");
}

// Examples:
// cn("btn", "btn-primary") // "btn btn-primary"
// cn("foo", undefined, "bar", false) // "foo bar"
// cn(false, undefined, "") // ""
// cn("header", "active", false) // "header active"
