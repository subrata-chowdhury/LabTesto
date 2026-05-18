// app/(mainLayout)/cart/component/CartPage.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import fetcher from "@/lib/fetcher";
import PatientDetailsPopup, {
  PatientDetails,
} from "../../../components/popups/PatientDetailsPopup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loading, { CartLoader } from "../loading";
import { SelectLocation } from "@/app/(mainLayout)/cart/component/SelectLocation";
import CartItemCard from "./CartItemCard";
import OrderTimeSelector from "./OrderTimeSelector";
import ConfirmationModel from "@/app/components/popups/ConfirmationModel";
import { User } from "../../profile/page";
import CheckBox from "@/components/Inputs/CheckBox";
import { useItemCountContext } from "@/app/contexts/ItemCountContext";
import SpinLoader from "@/components/loader/SpinLoader";
import { AnimatePresence, motion } from "framer-motion";
import { FaShoppingBag } from "react-icons/fa";

export type CartItem = {
  product: {
    test: {
      name: string;
      _id: string;
      labsDetails: { [key: string]: { lab: string; offer: number } };
    };
    lab: { name: string; _id: string; location: { address: Address } };
    price: number;
  };
  patientDetails: PatientDetails[];
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  user: string;
  createdAt: Date;
  updatedAt: Date;
};

type PageProps = {
  filterCartFunc?: (item: CartItem) => boolean;
  onFetchedCart?: () => void;
  showRemoveBtn?: boolean;
};

type UpdateCartPayload = {
  product: { test: string; lab: string };
  patientDetails?: PatientDetails[];
  address?: { pin: number; city: string; district: string; other?: string };
  quantity: number;
};

export const CartPage = ({
  filterCartFunc = () => true,
  onFetchedCart = () => {},
  showRemoveBtn = true,
}: PageProps) => {
  const [cart, setCart] = useState<Cart | null>(null);

  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPatientPopup, setShowPatientPopup] = useState<{
    cartIndex: number;
    patientIndex: number;
  } | null>(null);
  const [showScheduleOrderTimesModel, setShowScheduleOrderTimesModel] =
    useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState<{
    item: CartItem;
    index: number;
  } | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();
  const [patientDetails, setPatientDetails] = useState<PatientDetails[]>([]);
  const [allocatedTimes, setAllocatedTimes] = useState<string[]>([]);
  const [isPatientDetailsRequired, setIsPatientDetailsRequired] =
    useState(true);
  const orderItems = useRef<TempOrderDetails>(null);

  const { setItemCount } = useItemCountContext();
  const navigate = useRouter();

  useEffect(() => {
    fetchCart();
    fetchUser();
  }, []);

  useEffect(() => {
    if (selectedAddress?.pin) fetchAllocatedTimes(selectedAddress.pin);
  }, [selectedAddress?.pin]);

  async function fetchUser() {
    const res = await fetcher.get<User>("/user");
    if (res.status === 200 && res.body) {
      setPatientDetails(res.body.patientDetails);
    }
  }

  async function fetchCart() {
    try {
      const response = await fetcher.get<Cart>("/cart");
      if (response.status !== 200) {
        throw new Error("Failed to fetch cart");
      }
      if (response.body) {
        response.body.items = response.body.items.filter((item) =>
          filterCartFunc(item),
        );
        response.body.items.forEach((item) => {
          const labPrice =
            item.product.test.labsDetails[item.product.lab._id]?.offer;
          if (labPrice) {
            item.product.price = labPrice;
          }
        });
        setItemCount(response.body.items.length || 0);
        setCart(response.body);
        if (onFetchedCart) onFetchedCart();
      }
    } catch (err) {
      console.log(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllocatedTimes(pin: string) {
    try {
      const response = await fetcher.get<string[]>(
        "/allocated-times?pin=" + pin,
      );
      if (response.status === 200 && response.body) {
        setAllocatedTimes(response.body);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function updateCart(item: UpdateCartPayload, onSuccess: () => void) {
    try {
      const response = await fetcher.put<
        UpdateCartPayload,
        { message: string }
      >("/cart", item);
      if (response.status === 200 && response.body) onSuccess();
    } catch (err) {
      console.log(err);
      toast.error("Unable to update cart");
    }
  }

  async function changeQuantity(test: string, lab: string, quantity: number) {
    const updatedItem: UpdateCartPayload = {
      product: { test, lab },
      quantity,
    };
    await updateCart(updatedItem, fetchCart);
  }

  async function order(orderDetails: OrderDetails) {
    setShowLoading(true);
    const res = await fetcher.post<
      OrderDetails,
      { message: string; id: string }
    >(`/orders`, orderDetails);
    if (res.status === 200) {
      toast.success("Your orders has been placed");
      await fetcher.get<{ items: number }>("/cart/count").then((res) => {
        if (res.status === 200 && res.body) {
          setItemCount(res.body.items || 0);
        }
      });
      navigate.push("/order/" + res.body?.id);
    } else {
      toast.error(res.error || "Unable to place the order currently");
    }
    setShowLoading(false);
  }

  function verify(): boolean {
    if (
      !selectedAddress ||
      !selectedAddress.pin ||
      !selectedAddress.city ||
      !selectedAddress.district ||
      !selectedAddress.phone
    ) {
      toast.warning("Please select a valid address");
      return false;
    }
    return true;
  }

  const handleCheckoutAll = async () => {
    if ((cart?.items?.length || 0) <= 0) return toast.warning("Cart is empty");

    if (isPatientDetailsRequired) {
      for (let index = 0; index < (cart?.items?.length || 0); index++) {
        if (
          cart!.items[index].patientDetails.length < cart!.items[index].quantity
        ) {
          setShowPatientPopup({
            cartIndex: index,
            patientIndex: cart!.items[index].patientDetails.length,
          });
          return;
        }
      }
    }

    if (!verify()) return;
    if (!selectedAddress) return toast.warning("Please select a valid address");

    orderItems.current = {
      items: cart!.items.map((item) => ({
        product: { test: item.product.test._id, lab: item.product.lab._id },
        quantity: item.quantity,
      })),
      address: selectedAddress,
    };
    setShowScheduleOrderTimesModel(true);
  };

  if (loading) return <Loading />;
  if (showLoading) return <SpinLoader />;
  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="bg-primary text-white px-6 py-2 rounded-lg"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );

  const cartTotal =
    cart?.items?.reduce(
      (total, item) => total + (item.product.price || 0) * item.quantity,
      0,
    ) || 0;
  const hasItems = cart?.items?.length && cart?.items?.length > 0;

  return (
    <div className="flex-1 flex justify-center bg-gray-50 dark:bg-black min-h-screen pb-32 lg:pb-12">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left Side: Cart Flow */}
        <div className="flex-1 flex flex-col min-w-0">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-tight">
            Your Cart
          </h1>

          <SelectLocation
            selectedAddress={selectedAddress}
            onChange={(address) => setSelectedAddress(address)}
          />

          <div className="w-full flex gap-4 justify-between items-center py-4 px-5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm mb-6">
            <CheckBox
              label="Take the details at my location"
              value={!isPatientDetailsRequired}
              onChange={() => setIsPatientDetailsRequired((val) => !val)}
            />
          </div>

          {hasItems ? (
            <ul className="space-y-4 flex-1">
              <AnimatePresence>
                {cart.items.map((item, index) => (
                  <CartItemCard
                    key={`${item.product.test._id}-${item.product.lab._id}`}
                    item={item}
                    isPatientDetailsRequired={isPatientDetailsRequired}
                    onRemove={showRemoveBtn ? () => fetchCart() : undefined}
                    onQuantityChange={(quantity) =>
                      changeQuantity(
                        item.product.test._id,
                        item.product.lab._id,
                        quantity,
                      )
                    }
                    onOrder={() => {
                      if (!verify()) return;
                      setShowConfirmPopup({ item, index });
                    }}
                    onPatientClick={(i) =>
                      setShowPatientPopup({ cartIndex: index, patientIndex: i })
                    }
                  />
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col justify-center items-center h-64 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm"
            >
              <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-full flex items-center justify-center mb-4">
                <FaShoppingBag size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Cart is Empty
              </h2>
              <p className="text-gray-500 mt-2 text-center max-w-sm">
                Looks like you haven't added any tests to your cart yet.
              </p>
            </motion.div>
          )}
        </div>

        {/* Right Side: Order Summary / Checkout (Sticky on PC, Fixed Bottom on Mobile) */}
        {hasItems && (
          <div className="w-full lg:w-90 xl:w-100 shrink-0">
            <div
              className="fixed lg:mt-15 bottom-0 left-0 w-full bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-white/10 p-4 px-6 z-30 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] 
                            lg:sticky lg:top-24 lg:bg-white lg:dark:bg-[#111] lg:border lg:rounded-2xl lg:p-6 lg:shadow-sm lg:flex lg:flex-col lg:gap-6"
            >
              {/* Desktop Only: Summary Header & Breakdown */}
              <h2 className="hidden lg:block text-xl font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-100 dark:border-white/10">
                Order Summary
              </h2>

              <div className="hidden lg:flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between items-center">
                  <span>
                    Subtotal ({cart.items.length} item
                    {cart.items.length > 1 ? "s" : ""})
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                  <span>Home Collection</span>
                  <span className="font-medium">Free</span>
                </div>

                <div className="border-t border-gray-100 dark:border-white/10 mt-2 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    Total Amount
                  </span>
                  <span className="text-2xl font-extrabold text-primary dark:text-white">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Mobile View: Horizontal Layout */}
              <div className="flex justify-between items-center lg:hidden max-w-4xl mx-auto w-full">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Total Amount
                  </p>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-white">
                    ₹{cartTotal.toFixed(2)}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                    + Free Delivery
                  </div>
                </div>
                <button
                  className="bg-primary hover:bg-blue-700 dark:bg-primary/90 dark:hover:bg-primary text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-lg tracking-wide"
                  onClick={handleCheckoutAll}
                >
                  Checkout All
                </button>
              </div>

              {/* Desktop View: Full Width Button */}
              <button
                className="hidden lg:block w-full bg-primary hover:bg-blue-700 dark:bg-primary/90 dark:hover:bg-primary text-white font-bold px-4 py-4 rounded-xl transition-all active:scale-95 text-base tracking-wide"
                onClick={handleCheckoutAll}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals & Popups */}
      {showPatientPopup?.cartIndex != null && cart && (
        <PatientDetailsPopup
          patients={patientDetails}
          patientDetails={
            cart.items[showPatientPopup.cartIndex].patientDetails[
              showPatientPopup.patientIndex
            ]
          }
          onClose={() => setShowPatientPopup(null)}
          onSave={async (values) => {
            cart.items[showPatientPopup.cartIndex].patientDetails[
              showPatientPopup.patientIndex
            ] = values;
            updateCart(
              {
                product: {
                  test: cart.items[showPatientPopup.cartIndex].product.test._id,
                  lab: cart.items[showPatientPopup.cartIndex].product.lab._id,
                },
                patientDetails:
                  cart.items[showPatientPopup.cartIndex].patientDetails,
                quantity: cart.items[showPatientPopup.cartIndex].quantity,
              },
              () => fetchCart(),
            );
            setShowPatientPopup(null);
          }}
          onRemove={() => {
            cart.items[showPatientPopup.cartIndex].patientDetails.splice(
              showPatientPopup.patientIndex,
              1,
            );
            updateCart(
              {
                product: {
                  test: cart.items[showPatientPopup.cartIndex].product.test._id,
                  lab: cart.items[showPatientPopup.cartIndex].product.lab._id,
                },
                patientDetails:
                  cart.items[showPatientPopup.cartIndex].patientDetails,
                quantity: cart.items[showPatientPopup.cartIndex].quantity,
              },
              () => fetchCart(),
            );
            setShowPatientPopup(null);
          }}
        />
      )}

      {showScheduleOrderTimesModel && (
        <OrderTimeSelector
          excludeTimes={allocatedTimes}
          onClose={() => setShowScheduleOrderTimesModel(false)}
          onChange={async (dateTime) => {
            if (!verify()) return;
            if (!dateTime || !dateTime.start || !dateTime.end) {
              toast.warning("Please select sample taken date and time");
              return false;
            }
            if (dateTime.start > dateTime.end) {
              toast.warning(
                "Sample taken start time should be before end time",
              );
              return false;
            }
            if (orderItems.current === null) {
              toast.error("Unable to place the order currently");
              return;
            }
            const orderDetails = {
              ...orderItems.current,
              sampleTakenDateTime: dateTime,
            };
            await order(orderDetails);
          }}
        />
      )}

      {showConfirmPopup && (
        <ConfirmationModel
          msg={
            <div className="px-6 pt-6 text-center">
              <h3 className="text-xl font-bold mb-2">Order Single Test?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to order only this test:
              </p>
              <div className="font-bold text-lg text-primary dark:text-blue-400 my-3 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/10">
                {showConfirmPopup.item.product.test.name}
              </div>
              <p className="text-sm">
                from{" "}
                <span className="font-semibold">
                  {showConfirmPopup.item.product.lab.name}
                </span>
              </p>
            </div>
          }
          onDecline={() => setShowConfirmPopup(null)}
          onApprove={async () => {
            if (isPatientDetailsRequired) {
              if (
                showConfirmPopup.item.patientDetails.length <
                showConfirmPopup.item.quantity
              ) {
                setShowPatientPopup({
                  cartIndex: showConfirmPopup.index,
                  patientIndex: showConfirmPopup.item.patientDetails.length,
                });
                return;
              }
            }
            if (!verify()) return;
            if (!selectedAddress)
              return toast.warning("Please select a valid address");

            orderItems.current = {
              items: [
                {
                  product: {
                    test: showConfirmPopup.item.product.test._id,
                    lab: showConfirmPopup.item.product.lab._id,
                  },
                  quantity: showConfirmPopup.item.quantity,
                },
              ],
              address: selectedAddress,
            };
            setShowScheduleOrderTimesModel(true);
          }}
        />
      )}
    </div>
  );
};

type Address = {
  pin: string;
  city: string;
  district: string;
  other?: string;
  phone: string;
};

type TempOrderDetails = {
  items: { product: { test: string; lab: string }; quantity: number }[];
  address: Address;
  sampleTakenDateTime?: { start: Date; end: Date };
  reportDeliverTime?: { start: Date; end: Date };
};

type OrderDetails = {
  items: { product: { test: string; lab: string }; quantity: number }[];
  address: Address;
  sampleTakenDateTime: { start: Date; end: Date };
  reportDeliverTime?: { start: Date; end: Date };
};
