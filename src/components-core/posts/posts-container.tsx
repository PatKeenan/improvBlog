import { VStack, Button } from '@chakra-ui/react';
import { Determine } from '@components-feat';
import { usePosts } from '@lib/usePosts';
import { IoMdAdd } from 'react-icons/io';
import type { NextPage } from 'next';
import Link from 'next/link';
import moment from 'moment';
import {
  CardContent,
  CardFooter,
  CardTitle,
  SmallText,
  Card,
  H1,
} from '@components-common';

export const PostsContainer: NextPage = () => {
  const { posts, loading, error } = usePosts();
  return Determine({
    error,
    loading,
    component: posts ? (
      <VStack spacing={4} width="full" maxW="7xl" pt={3}>
        <Button colorScheme="blue" leftIcon={<IoMdAdd />} alignSelf="flex-end">
          <Link href={'/posts/create'} passHref>
            Create Post
          </Link>
        </Button>

        {posts.length > 0 ? (
          posts.map(i => {
            return (
              <Card key={i.post_uuid} link={i.post_uuid}>
                <CardTitle>{i.title}</CardTitle>
                <CardContent>{i.plot}</CardContent>
                <CardFooter>
                  <SmallText>Creator: {i.author.username}</SmallText>
                  <SmallText>
                    Created: {moment(i.createdAt).fromNow()}
                  </SmallText>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <H1>No Posts Yet</H1>
        )}
      </VStack>
    ) : null,
  });
};
