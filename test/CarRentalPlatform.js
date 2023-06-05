const CarRentalPlatform = artifacts.require("CarRentalPlatform");

contract("CarRentalPlatform", (accounts) => {
  const owner = accounts[0];
  const user = accounts[1];
  let carRentalPlatform;

  before(async () => {
    carRentalPlatform = await CarRentalPlatform.new({ from: owner });
  });

  it("should add a car", async () => {
    const carId = 1;
    const carName = "Car 1";

    const { logs } = await carRentalPlatform.addCar(carName, "", 0, 0, { from: owner });

    const carAddedEvent = logs.find((event) => event.event === "CarAdded");
    assert.exists(carAddedEvent, "CarAdded event not emitted");

    if (carAddedEvent && carAddedEvent.args) {
      const addedCarId = carAddedEvent.args.id.toNumber();
      assert.equal(addedCarId, carId, "CarId is not set correctly");
      assert.equal(carAddedEvent.args.name, carName, "Car name is not set correctly");
      assert.equal(carAddedEvent.args.imgUrl, "", "Car image URL is not set correctly");
      assert.equal(carAddedEvent.args.rentFee, 0, "Car rent fee is not set correctly");
      assert.equal(carAddedEvent.args.saleFee, 0, "Car sale fee is not set correctly");
    } else {
      assert.fail("Invalid carAddedEvent object");
    }
  });

  it("should edit car status", async () => {
    const carId = 1;
    const carName = "Car 1";
    const newStatus = 1; // Status.InUse

    await carRentalPlatform.addCar(carName, "", 0, 0, { from: owner });

    const { logs } = await carRentalPlatform.editCarStatus(carId, newStatus, { from: owner });

    const carStatusEditedEvent = logs.find((event) => event.event === "CarStatusEdited");
    assert.exists(carStatusEditedEvent, "CarStatusEdited event not emitted");
    assert.equal(carStatusEditedEvent.args.id, carId, "CarId is not set correctly");
    assert.equal(carStatusEditedEvent.args.status, newStatus, "Car status is not edited correctly");
  });

  it("should check out a car", async () => {
    const carId = 1;
    const carName = "Car 1";

    await carRentalPlatform.addCar(carName, "", 0, 0, { from: owner });

    try {
      await carRentalPlatform.checkOut(carId, { from: user });
      assert.fail("Non-owner was able to check out a car");
    } catch (error) {
      assert.include(error.message, "user does not exist", "Incorrect error message");
    }
  });

  it("should check in a car", async () => {
    const carId = 1;
    const carName = "Car 1";
  
    await carRentalPlatform.addCar(carName, "", 0, 0, { from: owner });
  
    try {
      await carRentalPlatform.checkIn({ from: user });
      assert.fail("Non-owner was able to check in a car");
    } catch (error) {
      assert.include(
        error.message.toLowerCase(),
        "user does not exist",
        "Incorrect error message"
      );
    }
  });
  

  it("should not allow non-owners to add a car", async () => {
    const carName = "Car 1";

    try {
      await carRentalPlatform.addCar(carName, "", 0, 0, { from: user });
      assert.fail("Non-owner was able to add a car");
    } catch (error) {
      assert.include(error.message, "Only the owner can call this function.", "Incorrect error message");
    }
  });
});

// Contract: CarRentalPlatformfrom solc-bin. Attempt #1                                                   
//     ✔ should add a car (76ms)from solc-bin. Attempt #1
//     ✔ should edit car status (147ms)lc-bin. Attempt #1
//     ✔ should check out a car (187ms)lc-bin. Attempt #1
//     ✔ should check in a car (102ms)olc-bin. Attempt #1
//     ✔ should not allow non-owners to add a cartempt #1                                                   


//   5 passing (698ms)