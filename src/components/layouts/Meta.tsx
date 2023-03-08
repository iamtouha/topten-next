import Head from "next/head";

type MetaProps = {
  siteName?: string;
  title?: string;
  description?: string;
  image?: string;
};

const Meta = ({
  siteName = "Top Ten Agro Chemicals",
  title = "Top Ten Agro Chemicals",
  description = "Your one stop shop for all your agrochemical needs",
  image = "https://debateai.vercel.app/api/og?title=Top%20Ten%20Agro%20Chemicals&description=Your%20one%20stop%20shop%20for%20all%20your%20agrochemical%20needs",
}: MetaProps) => {
  return (
    <Head>
      <meta name="description" content={description} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Meta;
