// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "src/Oracle.sol";

contract ContractTest is Test {
    Oracle o;
    address addr1 = address(this);
    address addr2 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    function setUp() public {
        o = new Oracle();
    }

    function testSetOwner() public {
        o.setOwner(addr2);
        assertEq(o.owner(), addr2);
    }

    function testSetBlock() public {
        bytes32[] memory txHashes = new bytes32[](1);
        bytes32 txHash0 = 0x3b20a350b04906019eee1e6849913fc160fcd3e84f33e286afd557f703d294ef;
        bytes32 txHash1 = 0xaf6413d97b58a57e98551ea2ef90aad41e827397aea1cbdca03e9f2e4cb6738f;
        txHashes[0] = txHash0;
        bool[] memory didSucceed = new bool[](1);
        didSucceed[0] = true;
        address miner = 0x829BD824B016326A401d083B33D092293333A830;
        uint32 bn = 3;

        vm.prank(addr2);
        vm.expectRevert(bytes("Only owner can post"));
        o.storeBlock(txHashes, didSucceed, bn, miner);
        vm.stopPrank();

        o.storeBlock(txHashes, didSucceed, bn, miner);

        IOracle.TxHashInfo memory info = o.getTxInfo(txHash0);
        assertEq(info.didSucceed, true);
        assertEq(info.coinbase, miner);
        assertEq(info.blockNumber, bn);

        vm.expectRevert(bytes("No tx info"));
        o.getTxInfo(txHash1);
    }
}
