import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="field-group" className={cn("grid gap-6", className)} {...props} />;
}

function Field({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="field" className={cn("grid gap-2", className)} {...props} />;
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
    return <Label data-slot="field-label" className={className} {...props} />;
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
    return <p data-slot="field-description" className={cn("text-muted-foreground text-xs", className)} {...props} />;
}

function FieldError({ className, ...props }: React.ComponentProps<"p">) {
    return <p data-slot="field-error" className={cn("text-destructive text-xs", className)} {...props} />;
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel };
