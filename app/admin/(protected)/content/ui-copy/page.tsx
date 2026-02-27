import { getCopyStrings } from '@/app/actions/admin';
import CopyStringsEditor from '@/components/admin/CopyStringsEditor';

export const revalidate = 0;

export default async function UICopyPage() {
    const strings = await getCopyStrings();

    return <CopyStringsEditor initialStrings={strings} />;
}
