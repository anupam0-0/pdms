
import RestrictedLayout from "@/utils/layouts/ProtectedLayout";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <RestrictedLayout>
            <div>
                {children}
            </div>
        </RestrictedLayout>
    );
}
