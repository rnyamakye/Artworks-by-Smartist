interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  href?: string;
}

export const ContactCard = ({
  icon,
  title,
  subtitle,
  children,
  href
}: ContactCardProps) => {
  return (
    <a href={href} className="bg-white w-full rounded-xl shadow-md">
      <div className="flex flex-col">
        <div className="bg-gray-200 rounded-t-xl flex justify-center items-center h-20">
          {icon}
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-1">{title}</h2>
          <p className="text-gray-500 text-sm mb-3">{subtitle}</p>
          {children}
        </div>
      </div>
    </a>
  );
};
