import dynamic from 'next/dynamic'

const ReactWEditor = dynamic(import("../../_components/edit/editor"), {
  ssr: false,
  loading: () => <p>Loading ...</p>, 
});

const Page = () => {
  return <ReactWEditor />
}


export default Page
