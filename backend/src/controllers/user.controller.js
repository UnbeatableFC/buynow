import { User } from "../models/user.model.js";

// ADDRESSES
export const addAddress = async (req, res) => {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const user = req.user;

    if (!fullName || !streetAddress || !city || !state) {
      return res
        .status(400)
        .json({ error: "Missing required address fields" });
    }

    // if this is set as default, unset the previous default
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label: label,
      fullName: fullName,
      streetAddress: streetAddress,
      city: city,
      state: state,
      zipCode: zipCode,
      phoneNumber: phoneNumber,
      isDefault: isDefault || false,
    });

    await user.save();

    res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error in addAddress controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Error in getAddresses controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const user = req.user;

    const { addressId } = req.params;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    // if this is set as default, unset the previous default
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault =
      isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();

    res.status(200).json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error in updateAddress controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = req.user;
    const { addressId } = req.params;

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    user.addresses.pull(addressId);
    await user.save();
    res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error in deleteAddress controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// WISHLIST
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Check if product is in the wishlist already
    if (user.wishlist.includes(productId)) {
      return res
        .status(400)
        .json({ error: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      message: "Product added to the wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error in addWishlist controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user;

    // Check if product is not in the wishlist already
    if (!user.wishlist.includes(productId)) {
      return res
        .status(400)
        .json({ error: "Product is not in wishlist" });
    }

    user.wishlist.pull(productId);
    await user.save();

    res.status(200).json({
      message: "Product removed from the wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error in removeWishlist controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    // We are using populate because wishlist is just an array of product ids
    const user = await User.findById(req.user._id).populate(
      "wishlist",
    );
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in getWishlist controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
