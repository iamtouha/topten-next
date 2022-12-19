import type { Post, Product } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { type NextPage } from "next";
import Head from "next/head";
import { Fragment, useMemo } from "react";
import { toast } from "react-toastify";

// components imports
import Button from "@/components/Button";
import Table from "@/components/Table";

// data imports
import { products } from "@/data/products";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { inferProcedureInput } from "@trpc/server";
import { AppRouter } from "@/server/trpc/router/_app";
import PlaygroundTable from "@/components/PlaygroundTable";

const Playground: NextPage = () => {
  // trpc
  const utils = trpc.useContext();
  const postsQuery = trpc.playground.list.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    }
  );

  const addPost = trpc.playground.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.playground.list.invalidate();
    },
  });

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  //   for (const { id } of allPosts) {
  //     void utils.post.byId.prefetch({ id });
  //   }
  // }, [postsQuery.data, utils]);

  return (
    <>
      <Head>
        <title>Playground | Top Ten Agro Chemicals</title>
      </Head>
      <main className="flex min-h-screen max-w-screen-xl flex-col gap-8 py-10 container-res">
        <PlaygroundTable />
        <h2>
          Latest Posts
          {postsQuery.status === "loading" && "(loading)"}
        </h2>
        <Button
          intent="primary"
          onClick={() => postsQuery.fetchPreviousPage()}
          disabled={
            !postsQuery.hasPreviousPage || postsQuery.isFetchingPreviousPage
          }
        >
          Previous
        </Button>
        {postsQuery.data?.pages.map((page, index) => (
          <Fragment key={page.items[0]?.id || index}>
            {page.items.map((item) => (
              <article key={item.id}>
                <h3>{item.title}</h3>
                <Link href={`/post/${item.id}`}>View more</Link>
              </article>
            ))}
          </Fragment>
        ))}
        <hr />
        <h3>Add a Post</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const $form = e.currentTarget;
            const values = Object.fromEntries(new FormData($form));
            type Input = inferProcedureInput<AppRouter["playground"]["add"]>;
            const input: Input = {
              title: values.title as string,
              text: values.text as string,
            };
            try {
              await addPost.mutateAsync(input);

              $form.reset();
            } catch (cause) {
              console.error({ cause }, "Failed to add post");
            }
          }}
        >
          <label htmlFor="title">Title:</label>
          <br />
          <input
            id="title"
            name="title"
            type="text"
            disabled={addPost.isLoading}
          />
          <br />
          <label htmlFor="text">Text:</label>
          <br />
          <textarea id="text" name="text" disabled={addPost.isLoading} />
          <br />
          <Button intent="primary" disabled={addPost.isLoading}>
            Submit
          </Button>
          {addPost.error && (
            <p style={{ color: "red" }}>{addPost.error.message}</p>
          )}
        </form>
      </main>
    </>
  );
};

export default Playground;
