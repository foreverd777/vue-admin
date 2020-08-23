import { reactive } from "@vue/composition-api";
export function pagination() {
  const pageData = reactive({
    currentPage: 1,
    pageSize: 5,
    total: 50,
    pageSizes: [2, 5, 10, 20],
  });
  const totalChange = (val) => {
    pageData.total = val;
  };
  const handleSizeChange = (val) => {
    pageData.pageSize = val;
  };

  const handleCurrentChange = (val) => {
    pageData.currentPage = val;
  };

  return {
    pageData,
    handleSizeChange,
    handleCurrentChange,
    totalChange,
  };
}
