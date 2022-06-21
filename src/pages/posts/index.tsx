import { VStack, Button, Link as ChakraLink, HStack } from '@chakra-ui/react';
import { SmallText, H1, Card, H3, Paragraph, Determine } from '@components';
import { IoMdAdd } from 'react-icons/io';
import type { NextPage } from 'next';
import Link from 'next/link';
import moment from 'moment';
import { usePosts } from '@lib/usePosts';
import * as React from 'react';

export const Posts: NextPage = () => {
  const { getPosts } = usePosts();
  const { data, fetchNextPage, isLoading, isError, hasNextPage, isFetching } =
    getPosts();

  return Determine({
    error: isError,
    loading: isLoading,
    component: data?.pages ? (
      <VStack
        spacing={4}
        width="full"
        maxW="7xl"
        p={3}
        marginInlineStart="auto"
        marginInlineEnd="auto"
        position="relative"
        overflow="auto"
      >
        <Link href={'/posts/create'}>
          <Button
            colorScheme="blue"
            leftIcon={<IoMdAdd />}
            alignSelf="flex-end"
          >
            Create Post
          </Button>
        </Link>

        {data.pages.map(page => {
          return page.posts.length > 0 ? (
            page.posts.map(i => {
              return (
                <Link
                  href={`/posts/${i.post_uuid}`}
                  passHref={true}
                  key={i.post_uuid}
                >
                  <ChakraLink
                    w="full"
                    _hover={{ textDecoration: 'none' }}
                    rounded="md"
                  >
                    <Card as={'a'} key={i.post_uuid}>
                      <VStack align="flex-start" w="full" spacing={4}>
                        <H3>{i.title}</H3>
                        <Paragraph textAlign="left" fontStyle="italic">
                          {i.plot}
                        </Paragraph>
                        <HStack>
                          <SmallText>Creator: {i.author.name}</SmallText>
                          <SmallText>
                            Created: {moment(i.createdAt).fromNow()}
                          </SmallText>
                        </HStack>
                      </VStack>
                    </Card>
                  </ChakraLink>
                </Link>
              );
            })
          ) : (
            <H1>No Posts Yet</H1>
          );
        })}
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} isLoading={isFetching}>
            Load More
          </Button>
        )}
      </VStack>
    ) : null,
  });
};

export default Posts;
