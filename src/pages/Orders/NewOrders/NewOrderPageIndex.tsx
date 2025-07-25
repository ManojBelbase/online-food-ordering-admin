import { orderApi } from "../../../server-action/api/orders"

const NewOrderPageIndex = () => {
  const {data:newOrder}= orderApi.useGetAll();
  console.log(newOrder, "neworder")
  return (
    <div>NewOrderPageIndex</div>
  )
}

export default NewOrderPageIndex