// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CharacterCertificate {
    address public owner;
    
    struct Certificate {
        string certificateId;
        string userId;
        string certHash;
        uint256 issueTimestamp;
        bool isValid;
    }
    
    mapping(string => Certificate) public certificates;
    mapping(string => bool) public isCertificateRegistered;
    
    event CertificateIssued(string certificateId, string userId, uint256 issueTimestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function issueCertificate(string memory _certificateId, string memory _userId, string memory _certHash) external onlyOwner {
        require(!isCertificateRegistered[_certificateId], "Certificate already exists");
        
        certificates[_certificateId] = Certificate({
            certificateId: _certificateId,
            userId: _userId,
            certHash: _certHash,
            issueTimestamp: block.timestamp,
            isValid: true
        });
        
        isCertificateRegistered[_certificateId] = true;
        emit CertificateIssued(_certificateId, _userId, block.timestamp);
    }
    
    function verifyCertificate(string memory _certificateId) external view returns (bool, string memory, string memory, uint256) {
        require(isCertificateRegistered[_certificateId], "Certificate not found");
        Certificate memory cert = certificates[_certificateId];
        return (cert.isValid, cert.userId, cert.certHash, cert.issueTimestamp);
    }
}
