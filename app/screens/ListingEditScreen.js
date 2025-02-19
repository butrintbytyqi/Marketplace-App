import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Screen from "../components/Screen";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import Text from "../components/Text";
import CategoryPicker from "../components/CategoryPicker";
import ImagePicker from "../components/ImagePicker";
import { colors, spacing, shadows, borderRadius } from "../config/theme";
import listingsApi from "../api/listings";
import useLocation from "../hooks/useLocation";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please add at least one image!"),
});

const categories = [
  {
    backgroundColor: "#fc5c65",
    icon: "floor-lamp",
    label: "Furniture",
    value: 1,
  },
  { backgroundColor: "#fd9644", icon: "car", label: "Cars", value: 2 },
  { backgroundColor: "#fed330", icon: "camera", label: "Cameras", value: 3 },
  { backgroundColor: "#26de81", icon: "cards", label: "Games", value: 4 },
  {
    backgroundColor: "#2bcbba",
    icon: "shoe-heel",
    label: "Clothing",
    value: 5,
  },
  { backgroundColor: "#45aaf2", icon: "basketball", label: "Sports", value: 6 },
  {
    backgroundColor: "#4b7bec",
    icon: "headphones",
    label: "Movies & Music",
    value: 7,
  },
  {
    backgroundColor: "#a55eea",
    icon: "book-open-variant",
    label: "Books",
    value: 8,
  },
  { backgroundColor: "#778ca3", icon: "application", label: "Other", value: 9 },
];

function ListingEditScreen({ route, navigation }) {
  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  // Get the listing and callback from route params if we're editing
  const listing = route.params?.listing;
  const onUpdateSuccess = route.params?.onUpdateSuccess;
  const isEditing = !!listing;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setProgress(0);
      setUploadVisible(true);

      console.log(isEditing ? "Updating listing with values:" : "Submitting listing with values:", {
        ...values,
        location,
        images: values.images ? values.images.length : 0,
      });

      // Call the appropriate API method
      const result = isEditing
        ? await listingsApi.updateListing(listing.id, { ...values, location })
        : await listingsApi.addListing({ ...values, location }, (progress) => setProgress(progress));

      console.log("API Response:", {
        ok: result.ok,
        status: result.status,
        problem: result.problem,
        data: result.data,
      });

      if (!result.ok) {
        setUploadVisible(false);
        const errorMessage =
          result.data?.error ||
          (result.problem === "NETWORK_ERROR" ? "Network error - check your connection" :
            result.problem === "TIMEOUT_ERROR" ? "Request timed out" :
              result.problem === "SERVER_ERROR" ? "Server error" :
                "Could not save the listing");
        return alert(errorMessage);
      }

      // Set progress to 1 to trigger the success animation
      setProgress(1);

      // Form will be reset when animation finishes and modal closes
      const handleDone = () => {
        setUploadVisible(false);
        resetForm();

        // Call success callback if provided (for updates)
        if (isEditing && onUpdateSuccess) {
          onUpdateSuccess();
        }

        navigation.goBack(); // Go back to previous screen
      };

      return handleDone;
    } catch (error) {
      console.log("Error submitting listing:", error);
      setUploadVisible(false);
      alert("An unexpected error occurred while saving the listing");
    }
  };

  return (
    <Screen style={styles.screen}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          <Text variant="title1" weight="bold" style={styles.title}>
            {isEditing ? "Edit Listing" : "Create a Listing"}
          </Text>
          <Text variant="body" color="secondary" style={styles.subtitle}>
            {isEditing ? "Update your listing details below" : "Fill in the details below to post your item"}
          </Text>

          <UploadScreen
            onDone={() => setUploadVisible(false)}
            progress={progress}
            visible={uploadVisible}
          />

          <Formik
            initialValues={{
              title: listing?.title || "",
              price: listing?.price.toString() || "",
              description: listing?.description || "",
              category: listing?.category || null,
              images: listing?.images || [],
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ handleChange, handleSubmit, errors, setFieldTouched, touched, values, setFieldValue }) => (
              <View style={styles.form}>
                <View style={styles.section}>
                  <Text variant="headline" weight="semibold" style={styles.sectionTitle}>
                    Photos
                  </Text>
                  <Text variant="caption1" color="secondary" style={styles.hint}>
                    Add up to 5 photos of your item
                  </Text>
                  <ImagePicker
                    images={values.images}
                    onChangeImages={(images) => setFieldValue("images", images)}
                    error={errors.images}
                    touched={touched.images}
                  />
                </View>

                <View style={styles.section}>
                  <Text variant="headline" weight="semibold" style={styles.sectionTitle}>
                    Item Details
                  </Text>

                  <TextInput
                    label="Title"
                    placeholder="What are you selling?"
                    onChangeText={handleChange("title")}
                    onBlur={() => setFieldTouched("title")}
                    value={values.title}
                    error={errors.title}
                    touched={touched.title}
                  />

                  <TextInput
                    label="Price"
                    placeholder="Enter your price"
                    onChangeText={handleChange("price")}
                    onBlur={() => setFieldTouched("price")}
                    value={values.price}
                    error={errors.price}
                    touched={touched.price}
                    keyboardType="numeric"
                    width="100%"
                    leftIcon="currency-usd"
                    style={styles.priceInput}
                  />

                  <View style={styles.categorySection}>
                    <Text variant="body" weight="medium" style={styles.inputLabel}>
                      Category
                    </Text>
                    <CategoryPicker
                      items={categories}
                      selectedItem={values.category}
                      onSelectItem={(category) => setFieldValue("category", category)}
                      error={errors.category}
                      touched={touched.category}
                    />
                  </View>

                  <TextInput
                    label="Description"
                    placeholder="Tell buyers about your item..."
                    onChangeText={handleChange("description")}
                    onBlur={() => setFieldTouched("description")}
                    value={values.description}
                    error={errors.description}
                    touched={touched.description}
                    multiline
                    numberOfLines={4}
                    style={styles.descriptionInput}
                  />
                </View>

                <Button
                  title={isEditing ? "Update Listing" : "Post Listing"}
                  onPress={handleSubmit}
                  style={styles.submitButton}
                />
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.m,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.l,
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    ...shadows.small,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  hint: {
    marginBottom: spacing.s,
  },
  categorySection: {
    marginBottom: spacing.m,
  },
  inputLabel: {
    marginBottom: spacing.xs,
  },
  priceInput: {
    marginBottom: spacing.m,
  },
  submitButton: {
    marginTop: spacing.m,
  },
  scrollContent: {
    padding: spacing.m,
  },
});

export default ListingEditScreen;
