"use client";
import {
  Button,
  Select,
  Typography,
  Option,
  IconButton,
} from "@material-tailwind/react";
import { Position, User } from "../../models/User";
import {
  deleteClass,
  fetchClasses,
  fetchClassRegisterForAdmin,
  fetchCourseClass,
  fetchUsers,
} from "../../services/service";
import { useEffect, useState } from "react";
import Loading from "../components/loading";
import Pagination from "../components/paging";
import { format } from "date-fns";
import { Class } from "../../models/Classes";
import loading from "../components/loading";
import { AlertType, useAlert } from "../components/Alert/alertbase";
import { MiddlewareAuthor } from "../../middleware/Author";
import { getCookieUser } from "@/services/authService";

function ReviewClass() {
  const [users, setClases] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentClasses, setCurrentClasses] = useState<Class[]>([]);
  const [originalClasses, setOriginalClasses] = useState<Class[]>([]);
  const { addAlert } = useAlert();
  const [user, setUser] = useState<User>({
    user_id: 0,
    username: "",
    name: "",
    cap_bac: "",
    chuc_vu: "",
    email: "",
    password: "",
    role: Position.STUDENT,
    avatar_url: null,
    is_active: true,
    created_at: "",
    faculty_id: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchTerm === "") {
      setClases(originalClasses);
    }
    const searchWords = searchTerm
      .split(" ")
      .map((word) => word.trim().toLowerCase())
      .filter((word) => word.length > 0);

    const filteredClasses = originalClasses.filter((clas) => {
      const userId = clas.class_id.toString().toLowerCase();
      const name = clas.name.toLowerCase();

      return searchWords.every(
        (word) => userId.includes(word) || name.includes(word)
      );
    });

    setClases(filteredClasses);
  };
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const userCurrent = getCookieUser();
        setUser(userCurrent!);

        const data = await fetchClasses();
        setClases(data);
        setOriginalClasses(data);
        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu lớp học:" + err);
        setLoading(false);
      }
    };

    loadClasses();
  }, []);
  const deleteConfirm = async function (id: number) {
    try {
      await deleteClass(id);
      const data = await fetchCourseClass();
      setClases(data);
      setOriginalClasses(data);
      addAlert(AlertType.success, "Đã xóa thành công.");
    } catch (err) {
      setError("Có lỗi xảy ra khi xóa dữ liệu  lớp học.");
    }
  };
  if (loading) return <Loading />;
  if (error)
    return (
      <div className="flex w-full h-full justify-center my-auto pt-10">
        {error}
      </div>
    );

  return (
    <div className="relative flex flex-col pb-20 w-full h-full overflow-scroll text-gray-700 bg-white shadow-md ">
      <div className="flex justify-between items-center">
        <Typography variant="h4" color="blue-gray" className="py-5 pl-5">
          Danh sách lớp học khoa(viện){" "}
          {currentClasses && currentClasses[0]
            ? currentClasses[0].Faculty?.name
            : ""}
        </Typography>
        <div className="flex justify-center">
          <div className="flex justify-center">
            <div className="relative h-10 w-full min-w-[200px] mr-2">
              <div className="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center text-blue-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  ></path>
                </svg>
              </div>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearch}
                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                placeholder=" "
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Tìm kiếm
              </label>
            </div>
            <Button
              ripple={true}
              color="blue"
              className="w-full"
              onClick={() => {
                setSearchTerm("");
                setClases(originalClasses);
              }}
            >
              Xóa tìm kiếm
            </Button>
          </div>
          <a href="/quan-ly-lop-hoc/them-moi" className="min-w-52">
            <Button ripple={true} className="bg-blue-700 mx-2">
              Thêm mới lớp học
            </Button>
          </a>
        </div>
      </div>
      <table className="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                ID
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                Tên lớp
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                Mô tả
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                Học phần
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                CVHT/GVBM
              </p>
            </th>

            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                Hành động
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentClasses.map((classes) => (
            <tr key={classes.class_id}>
              <td className="p-4 border-b border-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                  {classes.class_id}
                </p>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                  {classes.name}
                </p>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                  {classes.description}
                </p>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                  {classes.Course?.name}
                </p>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                  {classes.Advisor?.name}
                </p>
              </td>

              <td className="p-4 border-b border-blue-gray-50 flex justify-around">
                <a
                  target="_blank"
                  href={`/lop-hoc/${classes.class_id}`}
                  className="block font-sans text-sm antialiased font-medium leading-normal text-blue-gray-900"
                >
                  <Button color="blue" className="capitalize ml-2">
                    Đến lớp học
                  </Button>
                </a>
                <a
                  target="_blank"
                  href={`/danh-gia-lop-hoc/${classes.class_id}`}
                  className="block font-sans text-sm antialiased font-medium leading-normal text-blue-gray-900"
                >
                  <Button color="orange" className="capitalize ml-2">
                    Xem đánh giá
                  </Button>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        data={users}
        itemsPerPageOptions={[1, 2, 5, 10, 20, 50]}
        onPageChange={setCurrentClasses}
      />
    </div>
  );
}
export default MiddlewareAuthor(ReviewClass, [
  Position.SECRETARY,
  Position.ADVISOR,
]);
