<template>
  <div class="relative">
    <Card class="add-campsite w-screen h-[400px]">
      <template #title>Add campsite</template>
    
      <template #content>
        <div>
          <Stepper>
            <div>
              <StepperPanel header="Step 1: Campsite Details">
                <template #content="{ nextCallback }">
                  <div class="card flex flex-column md:flex-row gap-3 mt-20">
                    <InputGroup class="mb-4">
                        <InputGroupAddon>
                            <i class="pi pi-info"></i>
                        </InputGroupAddon>
                          <FloatLabel>
                            <InputText id="campsite_name" v-model="newCampsite.name" />
                            <label for="campsite_name">Campsite Name</label>
                          </FloatLabel>
                    </InputGroup>
                   
                    <InputGroup class="mb-4">
                        <InputGroupAddon>
                            <i class="pi pi-pencil"></i>
                        </InputGroupAddon>
                          <FloatLabel>
                            <InputText id="campsite_description" v-model="newCampsite.description" />
                            <label for="campsite_description">Campsite Description</label>
                          </FloatLabel>
                    </InputGroup>
                    <InputGroup class="mb-4">
                        <InputGroupAddon>
                            <i class="pi pi-euro"></i>
                        </InputGroupAddon>
                          <FloatLabel>
                            <InputNumber v-model="newCampsite.price" inputId="currency-germany" mode="currency" currency="EUR" locale="de-DE" />
                            <label for="campsite_price">Campsite Price</label>
                          </FloatLabel>
                    </InputGroup>
                    
                  </div>
                  
                  <Button label="Next" class="absolute bottom-1 right-1" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                  
                </template>
              </StepperPanel>
            </div>
            <div>
              <StepperPanel header="Step 2: Location & Amenities">
                <template #content="{ prevCallback, nextCallback }">
                  <div class="flex flex-column justify-center space-x-28">
                    <div class="w-full md:w-2/3">
                        <Map @locationSelected="updateAddress"></Map>
                      </div>
                    <div>
                      <label for="amenities">Amenities: </label>
                      <MultiSelect v-model="selectedAmenities" :options="amenitiesOptions" optionLabel="name" :maxSelectedLabels="3"></MultiSelect>
                    </div>
                    
                  </div>
                  
                  <div>
                    <Button class="absolute bottom-1 left-1" label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                    <Button class="absolute bottom-1 right-1" label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                  </div>
                
                </template>
              </StepperPanel>
            </div>
            <div>
              <StepperPanel header="Step 3: Upload Images">
                <template #content="{ prevCallback }">
                  <div class="flex flex-column">
                    <div class="mb-4">
                      <label for="images">Select Images:</label>
                      <input type="file" @change="handleImageUpload" multiple required />
                    </div>
                    <div v-if="uploadedImageUrls.length" class="uploaded-images mb-4">
                      <h3>Uploaded Images</h3>
                      <ul>
                        <li v-for="(url, index) in uploadedImageUrls" :key="index">
                          <a :href="url" target="_blank">{{ url }}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <Button class="absolute bottom-1 left-1" label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                    <Button class="absolute bottom-1 right-1" label="Finish" icon="pi pi-check" iconPos="right" @click="addCampsite" />
                  </div>
                </template>
              </StepperPanel>
            </div>
          </Stepper>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import MultiSelect from 'primevue/multiselect';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import InputNumber from 'primevue/inputnumber';
import router from '@/router';
import Map from './Map.vue';

const newCampsite = ref({
  name: '',
  address: '',
  amenities: '',
  latitude: '',
  longitude: '',
  images: [],
  price: 30
});

const amenitiesOptions = ref([]);
const selectedAmenities = ref([]);
const selectedImages = ref([]);
const uploadedImageUrls = ref([]);

const handleImageUpload = (event) => {
  selectedImages.value = Array.from(event.target.files);
};

const uploadImagesToS3 = async (images) => {
  AWS.config.update({
    accessKeyId: 'AKIA2UC3E6PENA4EJDTR',
    secretAccessKey: '/4KjvIbqlBKjnyEQSb9mP0IJB/osxogtGcIPeBx0',
    region: 'eu-north-1' // Your AWS region
  });

  const s3 = new AWS.S3();
  const uploadedUrls = [];

  for (const image of images) {
    const params = {
      Bucket: 'camping-project', // Your S3 bucket name
      Key: `camping-images/${uuidv4()}-${image.name}`,
      Body: image
    };

    try {
      const data = await s3.upload(params).promise();
      uploadedUrls.push(data.Location);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  return uploadedUrls;
};

const GetAmenities = async () => {
  try {
    const amenities = await fetch("https://localhost:7084/Amenities/GetAllAmenities");
    const data = await amenities.json();
    amenitiesOptions.value = data;
  } catch {
    console.log("Error occurred with fetching amenities");
  }
};



const updateAddress = (data) => {
  newCampsite.value.address = data.address;
  newCampsite.value.coordinates = data.coordinates;
  console.log('Map Address:', data.address);
};

const addCampsite = async () => {
  try {
    const imageUrls = await uploadImagesToS3(selectedImages.value);
    uploadedImageUrls.value = imageUrls;

    const campsiteData = {
      address: newCampsite.value.address,
      coordinates: newCampsite.value.coordinates,
      name: newCampsite.value.name,
      description: newCampsite.value.description,
      images: imageUrls,
      price: newCampsite.value.price
    };

    const response = await fetch('https://localhost:7084/Campsite/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(campsiteData)
    });

    if (!response.ok) {
      throw new Error('Failed to add campsite');
    }

    const responseData = await response.text();
    const campsiteId = responseData;

    for (const amenity of selectedAmenities.value) {
      await fetch(`https://localhost:7084/Amenities/AddAmenityToCampsite?amenity_id=${amenity.id}&campsite_id=${campsiteId}`, {
        method: 'POST'
      });
    }

    newCampsite.value = {
      name: '',
      address: '',
      description: '',
      coordinates: [],
      amenities: [],
      images: [],
      price: 30
    };
    selectedImages.value = [];
    uploadedImageUrls.value = [];
    selectedAmenities.value = [];

    alert('Campsite added successfully!');
  } catch (error) {
    console.error('Error adding campsite:', error);
    alert('Failed to add campsite');
  }
};


onMounted(() => {
  if (!sessionStorage.getItem("jwtToken")) {
    router.push('/');
  }
  GetAmenities();
});
</script>

<style scoped>
.uploaded-images ul {
  list-style: none;
  padding: 0;
}

.uploaded-images li {
  margin-bottom: 0.5em;
}
</style>
