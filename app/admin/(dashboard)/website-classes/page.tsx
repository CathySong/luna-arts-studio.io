import WebsiteClassesManager from "@/components/crm/WebsiteClassesManager";
import { listWebsiteClasses } from "@/lib/crm/website-classes";

export const dynamic = "force-dynamic";

export default async function WebsiteClassesPage() {
  const classes = await listWebsiteClasses(true);
  return (
    <div className="space-y-8">
      <div>
        <div className="font-display text-3xl text-gray-darkest tracking-wide">Website Classes</div>
        <p className="mt-2 text-sm text-gray-darker">Add or edit the weekly schedule. Saved changes appear on the website and flyer immediately.</p>
      </div>
      <WebsiteClassesManager initialClasses={classes} />
    </div>
  );
}
