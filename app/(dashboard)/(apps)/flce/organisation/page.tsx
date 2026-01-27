import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import SeasonManager from "@/components/flce/SeasonManager";
import OrganisationReferenceManager from "@/components/flce/OrganisationReferenceManager";

export default function FlceOrganisation() {
  return (
    <PageShell>
      <PageHeader title="Organisation" />
      <div className="space-y-6">
        <SeasonManager />
        <OrganisationReferenceManager />
      </div>
    </PageShell>
  );
}
