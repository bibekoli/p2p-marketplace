export default async function ItemNotFound() {
  return (
    <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto">
      <div className={`flex flex-col md:w-1/2 m-4 relative rounded-xl`}>
        <div className="w-full h-96 bg-gray-200 rounded-xl"></div>
      </div>
      <div className="flex flex-col md:w-1/2 m-4">
        <h1 className={`text-3xl font-[800]`}>Item Not Found</h1>
      </div>
    </div>
  )
}