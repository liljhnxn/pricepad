// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PricePad
 * @notice Simple Web3 pricing and price record sharing for freelancers and small businesses.
 */
contract PricePad {
    enum Status {
        Available, // 0
        Accepted,  // 1
        Rejected   // 2
    }

    struct Record {
        uint256 id;
        address creator;
        string name;
        string description;
        uint256 price;
        Status status;
        uint256 createdAt;
    }

    // Custom errors
    error EmptyName();
    error InvalidPrice();
    error RecordNotFound();
    error NotCreator();
    error InvalidStatusChange();

    // Events
    event RecordCreated(
        uint256 indexed id,
        address indexed creator,
        string name,
        uint256 price,
        uint256 createdAt
    );

    event StatusUpdated(
        uint256 indexed id,
        Status newStatus,
        address indexed updater
    );

    uint256 private _totalRecords;
    mapping(uint256 => Record) private _records;
    mapping(address => uint256[]) private _creatorRecordIds;

    /**
     * @notice Create a new price record
     * @param name Name of the product or service
     * @param description Brief description of the offer
     * @param price Price amount (must be > 0)
     * @return id The generated unique record ID
     */
    function createRecord(
        string calldata name,
        string calldata description,
        uint256 price
    ) external returns (uint256 id) {
        if (bytes(name).length == 0) {
            revert EmptyName();
        }
        if (price == 0) {
            revert InvalidPrice();
        }

        _totalRecords++;
        id = _totalRecords;

        Record memory newRecord = Record({
            id: id,
            creator: msg.sender,
            name: name,
            description: description,
            price: price,
            status: Status.Available,
            createdAt: block.timestamp
        });

        _records[id] = newRecord;
        _creatorRecordIds[msg.sender].push(id);

        emit RecordCreated(id, msg.sender, name, price, block.timestamp);
    }

    /**
     * @notice Update the status of a price record
     * @param id Unique record ID
     * @param newStatus New status (Accepted or Rejected)
     */
    function updateStatus(uint256 id, Status newStatus) external {
        if (id == 0 || id > _totalRecords) {
            revert RecordNotFound();
        }

        Record storage record = _records[id];

        if (record.creator != msg.sender) {
            revert NotCreator();
        }

        // Only allow transitioning to Accepted or Rejected
        if (newStatus != Status.Accepted && newStatus != Status.Rejected) {
            revert InvalidStatusChange();
        }

        // Once finalized as Accepted or Rejected, cannot be changed again
        if (record.status != Status.Available) {
            revert InvalidStatusChange();
        }

        record.status = newStatus;

        emit StatusUpdated(id, newStatus, msg.sender);
    }

    /**
     * @notice Retrieve a record by its unique ID
     * @param id Unique record ID
     */
    function getRecord(uint256 id) external view returns (Record memory) {
        if (id == 0 || id > _totalRecords) {
            revert RecordNotFound();
        }
        return _records[id];
    }

    /**
     * @notice Retrieve all records created by the caller
     */
    function getMyRecords() external view returns (Record[] memory) {
        uint256[] memory ids = _creatorRecordIds[msg.sender];
        uint256 count = ids.length;
        Record[] memory records = new Record[](count);

        for (uint256 i = 0; i < count; i++) {
            records[i] = _records[ids[i]];
        }

        return records;
    }

    /**
     * @notice Get total number of records created
     */
    function getTotalRecords() external view returns (uint256) {
        return _totalRecords;
    }
}

