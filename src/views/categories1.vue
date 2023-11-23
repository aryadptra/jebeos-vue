<template>
  <div>
    <Card
      id="card"
      title="Data Categories"
      subtitle="Category data will shown here"
    >
      <Modal
        title="Add Category"
        label="Add Categories"
        :activeModal="show"
        @close="toggleModal"
      >
        <form @submit.prevent="onSubmit" class="space-y-4">
          <Textinput
            label="Name"
            name="name"
            type="text"
            placeholder="Category name"
            v-model="form.name"
          />
          <Button
            class="mt-5"
            text="Save"
            type="submit"
            btnClass="btn-primary"
          />
        </form>
      </Modal>
      <div>
        <VueGoodTable
          class="mt-5"
          styleClass="vgt-table"
          :columns="columns"
          :rows="rows"
        />
      </div>
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
import { useRouter } from "vue-router";
import { ref } from "vue";
import { reactive } from "vue";

export default {
  components: {
    Button,
    Card,
    VueGoodTable,
    Modal,
    Textinput,
  },
  setup() {
    const toast = useToast();
    const show = ref(false);

    const toggleModal = () => {
      console.log(show);
    };

    const form = reactive({
      name: "",
    });

    const onSubmit = async () => {
      await axiosClient
        .post("categories", {
          name: form.name,
        })
        .then((response) => {
          toast.success("Success", {
            timeout: 2000,
          });
          form.name = "";
          console.log(response);
        })
        .catch((error) => {
          toast.error("Error", {
            timeout: 2000,
          });
        });
    };

    return {
      form,
      show,
      onSubmit,
      toggleModal,
    };
  },

  methods: {
    async fetchData() {
      try {
        const response = await axiosClient.get("categories");
        if (response) {
          // Tambahkan nomor urut pada setiap objek data
          this.rows = response.data.data.map((item, index) => {
            return { ...item, number: index + 1 };
          });
        }
      } catch (error) {
        throw error;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
  data() {
    return {
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
      ],
      rows: [],
    };
  },
};
</script>
