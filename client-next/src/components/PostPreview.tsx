// src/components/PostPreview.tsx
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import path from 'path';
import Card from './ui/Card';

const PostMeta = styled.div`
    font-size: 15px;
    color: ${theme.text.colour.light_grey()};
    font-style: italic;
    padding-top: 7px;
    padding-bottom: 7px;
`;

const PostTitle = styled.div`
    font-size: 15px;
    text-transform: uppercase;
    font-variant: small-caps;
    padding-bottom: 7px;
`;

const PostImage = styled.img`
    display: block;
    margin: auto;
    max-height: 140px;
    max-width: 90%;

    filter: sepia(20%); // adds yellow tint
`;

const DropCap = styled.span`
    float: left;
    font-size: 4.75em;
    font-family: Georgia, serif;
    line-height: 40px;
    margin-right: 0.1em;
    color: ${theme.theme_colours[5]()};
`;

const Summary = styled.p`
    text-align: left;
    text-justify: none;
    font-size: 13px;
`;

const Date = styled.span`
    display: inline;
    padding-left: 5px;
    color: ${theme.theme_colours[5]()};
`;

const PostPreview = (props: PostMetadata) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(path.join("/", props.section, props.slug));
    }

    const firstLetter = props.summary.charAt(0);
    const restOfSummary = props.summary.slice(1);

    return (
        <Card onClick={handleClick}>
            <PostMeta>{props.blurb}</PostMeta>
            <PostTitle>{props.title}</PostTitle>
            <PostImage src={props.coverImage} alt={props.title} />
            <PostMeta>{props.author}</PostMeta>
            <Summary>
                <DropCap>{firstLetter}</DropCap>{restOfSummary}... <Date>{props.date}</Date>
            </Summary>
        </Card>
    )
}

export default PostPreview;