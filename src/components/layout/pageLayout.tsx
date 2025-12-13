import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function PageLayout({
  breadcrumbs,
  title,
  children,
}: {
  breadcrumbs: {
    label: string;
    href?: string;
  }[];
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="w-3xl container mx-auto px-4 py-6 flex flex-col flex-1 overflow-hidden space-y-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="shrink-0">
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href || "#"}>
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        {title && (
          <div className="shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          </div>
        )}

        <div className="flex flex-col items-center">{children}</div>
      </div>
    </div>
  );
}
