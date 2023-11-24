<template>
  <div>
    <Card
      id="card"
      title="Data Products"
      subtitle="Products will be shown here"
    >
      <Modal
        title="Add Products"
        label="Add Products"
        labelClass="btn-outline-dark"
        ref="modalRef"
        centered
        @click="onCategoryChange"
      >
        <form @submit.prevent="onSubmit" class="space-y-4">
          <Select
            label="Category"
            name="category_id"
            :options="categories"
            placeholder="Select product category"
            v-model="form.category_id"
          />
          <Textinput
            label="Name"
            name="name"
            type="text"
            placeholder="Your product name"
            v-model="form.name"
          />
          <Textarea
            label="Description"
            name="description"
            placeholder="Write a short description about your product"
            v-model="form.description"
          />
          <Fileinput
            label="Thumbnail"
            name="thumbnail"
            placeholder="Input your product thumbnail"
            @change="handleThumbnailChange"
          />
          <img
            v-if="form.thumbnail"
            :src="form.thumbnail"
            class="rounded-md max-w-full w-full block"
          />

          <Textinput
            label="Stock"
            name="stock"
            type="number"
            placeholder="Input product stock"
            v-model="form.stock"
          />
          <Textinput
            label="Buying Price"
            name="buying_price"
            type="number"
            placeholder="Input buying product price value"
            v-model="form.buying_price"
          />
          <Textinput
            label="Selling Price"
            name="selling_price"
            type="number"
            placeholder="Input selling product price value"
            v-model="form.selling_price"
          />
          <Select
            label="Status"
            name="status"
            :options="options"
            placeholder="Select product status"
            v-model="form.status"
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
              v-if="props.column.field == 'thumbnail'"
              class="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none"
            >
              <img
                :src="props.row.thumbnail"
                :alt="props.row.name"
                class="rounded-md max-w-full w-full block"
              />
            </span>
            <span
              v-if="props.column.field == 'buying_price'"
              class="font-medium"
            >
              {{ formatRupiah(props.row.buying_price) }}
            </span>
            <span
              v-if="props.column.field == 'selling_price'"
              class="font-medium"
            >
              {{ formatRupiah(props.row.selling_price) }}
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
    </Card>
  </div>
</template>
<script>
import { reactive, ref, onMounted } from "vue";
import { useToast } from "vue-toastification";

import axiosClient from "@/plugins/axios";

import Card from "@/components/Card";
import Modal from "@/components/Modal/Modal.vue";
import Textinput from "@/components/Textinput";
import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import Fileinput from "@/components/Fileinput";
import Select from "@/components/Select";

import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import Pagination from "@/components/Pagination";
import { advancedTable } from "../constant/basic-tablle-data";
import { VueGoodTable } from "vue-good-table-next";
import axios from "axios";

export default {
  components: {
    Button,
    Card,
    VueGoodTable,
    Modal,
    Select,
    Textinput,
    Textarea,
    Fileinput,
    Pagination,
    Icon,
    Tooltip,
  },
  methods: {
    formatRupiah(angka) {
      const formattedAngka = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(parseFloat(angka));
      return formattedAngka;
    },
    onCategoryChange() {
      // Panggil categoriesData untuk memperbarui data kategori
      this.categoriesData();
    },
  },
  setup() {
    const toast = useToast();
    const modalRef = ref(null);

    const options = [
      { value: "DRAFT", label: "DRAFT" },
      { value: "PUBLISH", label: "PUBLISH" },
      { value: "INACTIVE", label: "INACTIVE" },
    ];

    const categories = reactive([]);

    const categoriesData = async () => {
      try {
        const result = await axiosClient.get("categories");

        const transformedData = result.data.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        categories.value = transformedData;
        console.log(categories.value);
        // console.log(options);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const handleThumbnailChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          form.thumbnail = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const form = reactive({
      category_id: "",
      name: "",
      description: "",
      thumbnail: "",
      stock: "",
      buying_price: "",
      selling_price: "",
      status: "",
    });

    const onSubmit = async () => {
      try {
        await axiosClient
          .post("products", {
            category_id: form.category_id,
            name: form.name,
            description: form.description,
            thumbnail: form.thumbnail,
            stock: form.stock,
            buying_price: form.buying_price,
            selling_price: form.selling_price,
            stock: form.stock,
          })
          .then((result) => {
            modalRef.value.closeModal();
            toast.success(result.data.message, { timeout: 2000 });
            form.category_id = "";
            form.name = "";
            form.description = "";
            form.thumbnail = "";
            form.stock = "";
            form.buying_price = "";
            form.selling_price = "";
            form.stock = "";
            refreshData();
          });
      } catch (error) {
        modalRef.value.closeModal();
        form.category_id = "";
        form.name = "";
        form.description = "";
        form.thumbnail = "";
        form.stock = "";
        form.buying_price = "";
        form.selling_price = "";
        form.stock = "";
        toast.error(error, { timeout: 2000 });
      }
    };

    const refreshData = async () => {
      try {
        const result = await axiosClient.get("products");
        state.rows = result.data.data.map((item, index) => ({
          ...item,
          number: index + 1,
        }));
      } catch (error) {
        throw error;
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
          label: "Thumbnail",
          field: "thumbnail",
        },
        {
          label: "Name",
          field: "name",
        },
        {
          label: "Code",
          field: "code",
        },
        {
          label: "Description",
          field: "description",
        },
        {
          label: "Stock",
          field: "stock",
        },
        {
          label: "Buying Price",
          field: "buying_price",
        },
        {
          label: "Selling Price",
          field: "selling_price",
        },
        {
          label: "Status",
          field: "status",
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

    onMounted(() => {
      refreshData();
      categoriesData();
    });

    return {
      options,
      modalRef,
      handleThumbnailChange,
      form,
      onSubmit,
      state,
      refreshData,
      categoriesData,
      categories,
    };
  },
};
</script>
