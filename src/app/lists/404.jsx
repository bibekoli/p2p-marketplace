export default function ListNotFound({ message }) {
  return (
    <div className="max-w-screen-xl mx-auto mt-[80px]">
      {/* empty inbox */}
      <div className="m-4 p-4 rounded-lg flex flex-col items-center justify-center h-[calc(80vh-80px)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 50 50"><path fill="currentColor" d="M25.562 2.966L0 21h6v22h4V28h8v15h27V21h5L25.562 2.966zM42 37H23v-9h19v9zm0-12H9v-8h33v8zm-2-6v4H11v-4h29m1-1H10v6h31v-6z"/></svg>
        <div className="text-lg font-bold mt-4">{message}</div>
      </div>
    </div>
  )
}