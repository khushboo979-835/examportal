import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Control Center | StudyFree PDF & DDIS',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
