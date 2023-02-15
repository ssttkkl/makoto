import { useSearchParams } from '@umijs/max';
import Editor from '../../components/Editor';

const DocPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const rawFid = searchParams.get('fid');
  const fid = rawFid !== null ? Number.parseInt(rawFid) : undefined;

  return fid !== undefined ? <Editor fid={fid} /> : null;
};

export default DocPage;
