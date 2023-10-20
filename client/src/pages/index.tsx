import { GetStaticProps } from 'next';
import fetchPostMetadata from '@utils/fetchPostMetadata';
import IndexPage from '@components/pages/index-page/IndexPage';

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            posts: fetchPostMetadata('blog')
        }
    };
};

import { APPLICATION_METADATA } from '@constants/config';

const Index = ({ posts }: { posts: PostMetadata[] }) => {
    APPLICATION_METADATA.title = "DN | Blog";

    return <IndexPage posts={posts} meta={APPLICATION_METADATA} />;
};

export default Index;