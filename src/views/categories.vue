<template>
  <div>
    <Card
      id="card"
      title="Data Categories"
      subtitle="Category data will be shown here"
    >
      <Modal
        title="Edit Category"
        label="Edit Category"
        labelClass="btn-outline-dark hidden"
        ref="modalEditRef"
        centered
      >
        <form @submit.prevent="onEditSubmit" class="space-y-4">
          <Textinput
            label="Name"
            name="name"
            type="text"
            placeholder="Category name"
            v-model="formEdit.name"
          />
          <Button class="mt-5" text="Save" type="submit" btnClass="btn-dark" />
        </form>
      </Modal>
      <Modal
        title="Add Category"
        label="Add Category"
        labelClass="btn-outline-dark"
        ref="modalRef"
        centered
      >
        <form @submit.prevent="onSubmit" class="space-y-4">
          <Textinput
            label="Name"
            name="name"
            type="text"
            placeholder="Category name"
            v-model="form.name"
          />
          <Button class="mt-5" text="Save" type="submit" btnClass="btn-dark" />
        </form>
      </Modal>
      <div>
        <vue-good-table
          :columns="state.columns"
          styleClass="vgt-table lesspadding2 centered mt-5"
          :rows="state.rows"
          :pagination-options="{
            enabled: true,
            perPage: state.perpage,
          }"
          :sort-options="{
            enabled: false,
          }"
          :select-options="{
            enabled: true,
            selectOnCheckboxOnly: true,
            selectioninfoClass: 'custom-class',
            selectionText: 'rows selected',
            clearSelectionText: 'clear',
            disableSelectinfo: true,
            selectAllByGroup: true,
          }"
        >
          <template v-slot:table-row="props">
            <span v-if="props.column.field == 'name'" class="font-medium">
              {{ props.row.name }}
            </span>
            <span
              v-if="props.column.field == 'created_at'"
              class="text-slate-500 dark:text-slate-400"
            >
              {{ props.row.created_at }}
            </span>
            <span
              v-if="props.column.field == 'updated_at'"
              class="text-slate-500 dark:text-slate-400"
            >
              {{ props.row.created_at }}
            </span>
            <span v-if="props.column.field == 'action'">
              <div class="flex space-x-3 justify-center rtl:space-x-reverse">
                <Tooltip placement="top" arrow theme="dark">
                  <template #button>
                    <div
                      class="action-btn"
                      @click="openEditModal(props.row.id)"
                    >
                      <Icon icon="heroicons:pencil-square" />
                    </div>
                  </template>
                  <span>Edit</span>
                </Tooltip>
                <Tooltip placement="top" arrow theme="danger-500">
                  <template #button>
                    <div
                      class="action-btn"
                      @click="showDeleteConfirmationModal(props.row.id)"
                    >
                      <Icon icon="heroicons:trash" />
                    </div>
                  </template>
                  <span>Delete</span>
                </Tooltip>
              </div>
            </span>
          </template>
          <template #pagination-bottom="props">
            <div class="py-4 px-3 flex justify-center">
              <Pagination
                :total="50"
                :current="state.current"
                :per-page="state.perpage"
                :pageRange="state.pageRange"
                @page-changed="state.current = $event"
                :pageChanged="props.pageChanged"
                :perPageChanged="props.perPageChanged"
              >
                >
              </Pagination>
            </div>
          </template>
        </vue-good-table>
      </div>
      <Modal
        title="Delete Confirmation"
        label="Delete"
        labelClass="btn-danger hidden"
        ref="deleteModalRef"
        centered
      >
        <div>
          <p>Are you sure you want to delete this category?</p>
          <div class="flex justify-end mt-4">
            <Button
              text="Cancel"
              btnClass="btn-secondary"
              @click="closeDeleteConfirmationModal"
            />
            <Button
              text="Delete"
              btnClass="btn-danger ml-2"
              @click="deleteCategory"
            />
          </div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card";
import { VueGoodTable } from "vue-good-table-next";
import axiosClient from "@/plugins/axios";
import Modal from "@/components/Modal/Modal.vue";
import Textinput from "@/components/Textinput";
import Button from "@/components/Button";
import { useToast } from "vue-toastification";
import { reactive, ref, onMounted } from "vue";

import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import Pagination from "@/components/Pagination";
import { advancedTable } from "../constant/basic-tablle-data";

export default {
  components: {
    Button,
    Card,
    VueGoodTable,
    Modal,
    Textinput,
    Pagination,
    Icon,
    Tooltip,
  },
  setup() {
    const toast = useToast();
    const modalRef = ref(null);
    const modalEditRef = ref(null);
    const deleteModalRef = ref(null);
    const deleteCategoryId = ref(null);

    const showDeleteConfirmationModal = (categoryId) => {
      deleteCategoryId.value = categoryId;
      deleteModalRef.value.openModal();
    };

    const closeDeleteConfirmationModal = () => {
      deleteCategoryId.value = null;
      deleteModalRef.value.closeModal();
    };

    const deleteCategory = async () => {
      try {
        // Menggunakan axios untuk menghapus kategori
        await axiosClient.delete(`categories/${deleteCategoryId.value}`);
        toast.success("Category deleted successfully", { timeout: 2000 });

        // Refresh data setelah menghapus kategori
        refreshData();

        // Menutup modal konfirmasi delete
        closeDeleteConfirmationModal();
      } catch (error) {
        toast.error("Error deleting category", { timeout: 2000 });
        console.error(error);
      }
    };

    const form = reactive({
      name: "",
    });

    const formEdit = reactive({
      categoryId: "",
      name: "",
    });

    const openEditModal = (categoryId) => {
      // Misal, kita asumsikan ada endpoint '/categories/:id'
      axiosClient
        .get(`categories/${categoryId}`)
        .then((response) => {
          formEdit.categoryId = response.data.data.id;
          formEdit.name = response.data.data.name;
        })
        .catch((error) => {});
      modalEditRef.value.openModal();
    };

    const onEditSubmit = async () => {
      try {
        // Menggunakan ID dari kategori yang akan di-edit
        await axiosClient.put(`categories/${formEdit.categoryId}`, {
          name: formEdit.name,
        });
        modalEditRef.value.closeModal();
        toast.success("Category updated successfully", { timeout: 2000 });
        formEdit.name = "";
        refreshData();
      } catch (error) {
        toast.error(error, { timeout: 2000 });
      }
    };

    const state = reactive({
      advancedTable,
      current: 1,
      perpage: 10,
      pageRange: 5,
      searchTerm: "",
      columns: [
        {
          label: "Number",
          field: "number",
        },
        {
          label: "Name",
          field: "name",
        },
        {
          label: "Created On",
          field: "created_at",
        },
        {
          label: "Updated On",
          field: "updated_at",
        },
        {
          label: "Action",
          field: "action",
        },
      ],
      rows: [],
    });

    const refreshData = async () => {
      try {
        const result = await axiosClient.get("categories");
        state.rows = result.data.data.map((item, index) => ({
          ...item,
          number: index + 1,
        }));
      } catch (error) {
        throw error;
      }
    };

    const onSubmit = async () => {
      try {
        await axiosClient
          .post("categories", { name: form.name })
          .then((result) => {
            modalRef.value.closeModal();
            toast.success(result.data.message, { timeout: 2000 });
            form.name = "";
            refreshData();
          });
      } catch (error) {
        toast.error(error, { timeout: 2000 });
      }
    };

    onMounted(() => {
      refreshData();
    });

    return {
      form,
      formEdit,
      state,
      modalRef,
      modalEditRef,
      deleteModalRef,
      openEditModal,
      deleteCategoryId,
      showDeleteConfirmationModal,
      closeDeleteConfirmationModal,
      onEditSubmit,
      deleteCategory,
      onSubmit,
      refreshData,
    };
  },
};
</script>
