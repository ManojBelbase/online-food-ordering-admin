import { PageHeader } from "../../components/GlobalComponents"
import { userApi } from "../../server-action/api/user"

const CategoryPageIndex = () => {
  const {data}= userApi.useGetAll();
  console.log(data, "uarapi")
  return (
    <div>
      <PageHeader title="Category "/>
    </div>
  )
}

export default CategoryPageIndex