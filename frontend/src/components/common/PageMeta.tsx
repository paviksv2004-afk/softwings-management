import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title?: string;
  description?: string;
}

const PageMeta = ({ title, description }: PageMetaProps) => {
  return (
    <Helmet>
      <title>{title ? `${title} | SoftWings` : 'SoftWings Management'}</title>
      <meta name="description" content={description || 'SoftWings Management System'} />
    </Helmet>
  );
};

export default PageMeta;