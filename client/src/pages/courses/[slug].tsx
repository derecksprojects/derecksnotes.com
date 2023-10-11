import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';

// redux for tag filter visibility
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

import TagFilter from '@components/ui/TagFilter';
import { PostContainer, Article, PostContentWrapper } from '@components/pages/post';
import SideBar from '@components/pages/post-page/SideBar';

const section: string = 'courses';

// ------------------------------------
// component imports to be used in MDX
import { mdxComponents } from '@components/pages/post-page/mdxComponents';

// ------------------------------------
// ------------------------------------
interface FrontMatter {
    slug?: string;
    title: string;
    blurb: string;
    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    published: boolean;
}

interface PostPageProps {
    title: string;
    source: any;
    side_bar_data: FrontMatter[];
}

const PostPage: React.FC<PostPageProps> = ({ title, source, side_bar_data }) => {
    // https://nextjs.org/docs/messages/react-hydration-error
    // Solution 1: Using useEffect to run on the client only; used to fix mathjax not rendering
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // remove the side_bar_data with published: false
    side_bar_data = side_bar_data.filter(post => post.published);

    // tag filter
    const all_tags: string[] = Array.from(new Set(side_bar_data.flatMap(post => post.tags))).sort();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // if no tags selected, show all posts
    const filteredPosts: FrontMatter[] = selectedTags.length > 0 ? side_bar_data.filter(
        post => selectedTags.some(tag => post.tags.includes(tag))
    ) : side_bar_data;

    const handleTagSelect = (tag: string) => {
        setSelectedTags(prev => [...prev, tag]);
    };

    const handleTagDeselect = (tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    };

    // redux control for tag filter visibility
    const tagsFilterVisible = useSelector((state: RootState) => state.visibility.tagsFilterVisible);

    return (
        <>
            <TagFilter
                tags={all_tags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onTagDeselect={handleTagDeselect}
                visible={tagsFilterVisible}
                styleContainer={{ width: '80%' }}
            />
            <PostContainer>
                <SideBar section={section} posts={filteredPosts} />
                <Article>
                    <h1>{title}</h1>
                    {isClient
                        &&
                        <PostContentWrapper>
                            <MDXRemote {...source} components={mdxComponents} />
                        </PostContentWrapper>}
                </Article>
            </PostContainer>
        </>
    );
}

// ----------------------------------------
import { getMDXSource, getSidebarData } from '@components/pages/post-page/postHelpers';

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const side_bar_data = getSidebarData(section);
    const mdxSource = await getMDXSource(section, params!.slug as string);

    // if not published, return 404
    if (!mdxSource.frontmatter.published) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            title: mdxSource.frontmatter.title,
            source: mdxSource.source,
            side_bar_data: side_bar_data
        },
    };
}

// ----------------------------------------
// the goal of this function getStaticPaths is to
// return a list of all possible values for slug
// so that nextjs can pre-render all the possible
import { getAllSlugs } from '@components/pages/post-page/postHelpers';

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllSlugs(section);

    return {
        paths,
        fallback: false
    };
}

export default PostPage;