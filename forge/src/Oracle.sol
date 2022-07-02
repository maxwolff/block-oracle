// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IOracle {
    // 1bytes + 8 + 20 (one slot)
    struct TxHashInfo {
        bool didSucceed;
        uint64 blockNumber;
        address coinbase;
    }

    function getTxInfo(bytes32 txHash)
        external
        view
        returns (TxHashInfo memory);
}

// @notice CAUTION HACKATHON UNAUDITED CODE. Oracle to post block data to
contract Oracle is IOracle {
    event StoreBlock(uint256 indexed blockNumber, address indexed coinbase);

    // tx hash => TxHashInfo
    mapping(bytes32 => TxHashInfo) public txInfos;

    // block => did save
    mapping(uint32 => bool) public didSaveBlock;

    /// @notice saves block info to storage
    /// @dev make only owner?
    function storeBlock(
        bytes32[] memory txHashes,
        bool[] memory didSucceed,
        uint32 blockNumber,
        address coinbase
    )
        public
    {
        require(txHashes.length == didSucceed.length, "Inconsistent lengths");
        // require(blockNumber < block.number, "Invalid info: future bn");// breaks testing
        require(didSaveBlock[blockNumber] == false, "already saved block");

        for (uint256 i = 0; i < txHashes.length; i++) {
            // TODO: require mapping has no entry under this txhash so we don't overwrite, or dont, to spare gas

            TxHashInfo storage info = txInfos[txHashes[i]];
            info.didSucceed = didSucceed[i];
            info.blockNumber = blockNumber;
            info.coinbase = coinbase;
        }
        didSaveBlock[blockNumber] = true;
        emit StoreBlock(blockNumber, coinbase);
    }

    /// @notice Returns tx info, reverts if tx was not saved
    function getTxInfo(bytes32 txHash)
        public
        view
        returns (TxHashInfo memory)
    {
        TxHashInfo memory info = txInfos[txHash];
        //find a better way to test null?
        require(info.blockNumber != 0, "No tx info");
        return info;
    }
}