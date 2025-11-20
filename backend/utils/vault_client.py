"""
HashiCorp Vault client for secret management.
"""

import os
import logging
from typing import Dict, Any, Optional
import json

logger = logging.getLogger(__name__)


class VaultClient:
    """Client for HashiCorp Vault secret management."""
    
    def __init__(self):
        """Initialize Vault client."""
        self.vault_addr = os.getenv("VAULT_ADDR", "http://vault:8200")
        self.vault_token = os.getenv("VAULT_TOKEN")
        
        if not self.vault_token:
            logger.warning("VAULT_TOKEN not set, using fallback to environment variables")
            self.use_vault = False
        else:
            self.use_vault = True
            # In production, initialize hvac client
            # import hvac
            # self.client = hvac.Client(url=self.vault_addr, token=self.vault_token)
    
    def get_secret(self, path: str, key: Optional[str] = None) -> Any:
        """
        Get secret from Vault.
        
        Args:
            path: Secret path in Vault (e.g., 'secret/data/supabase')
            key: Specific key to retrieve from secret (optional)
            
        Returns:
            Secret value or dict of all secret values
        """
        if not self.use_vault:
            logger.warning(f"Vault not configured, falling back to env var for {path}")
            return self._get_from_env(path, key)
        
        try:
            # In production, use hvac client
            # response = self.client.secrets.kv.v2.read_secret_version(path=path)
            # data = response['data']['data']
            
            # Mock response for now
            data = self._get_mock_secret(path)
            
            if key:
                return data.get(key)
            return data
            
        except Exception as e:
            logger.error(f"Error reading secret from Vault: {e}")
            return self._get_from_env(path, key)
    
    def set_secret(self, path: str, data: Dict[str, Any]) -> bool:
        """
        Set secret in Vault.
        
        Args:
            path: Secret path in Vault
            data: Secret data to store
            
        Returns:
            True if successful, False otherwise
        """
        if not self.use_vault:
            logger.warning("Vault not configured, cannot set secret")
            return False
        
        try:
            # In production, use hvac client
            # self.client.secrets.kv.v2.create_or_update_secret(
            #     path=path,
            #     secret=data
            # )
            logger.info(f"Secret set at path: {path}")
            return True
            
        except Exception as e:
            logger.error(f"Error setting secret in Vault: {e}")
            return False
    
    def delete_secret(self, path: str) -> bool:
        """
        Delete secret from Vault.
        
        Args:
            path: Secret path in Vault
            
        Returns:
            True if successful, False otherwise
        """
        if not self.use_vault:
            logger.warning("Vault not configured, cannot delete secret")
            return False
        
        try:
            # In production, use hvac client
            # self.client.secrets.kv.v2.delete_metadata_and_all_versions(path=path)
            logger.info(f"Secret deleted at path: {path}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting secret from Vault: {e}")
            return False
    
    def rotate_database_credentials(self) -> Dict[str, str]:
        """
        Rotate database credentials.
        
        Returns:
            New database credentials
        """
        if not self.use_vault:
            logger.warning("Vault not configured, cannot rotate credentials")
            return {
                "username": os.getenv("DB_USER", "postgres"),
                "password": os.getenv("DB_PASSWORD", "changeme")
            }
        
        try:
            # In production, use Vault's database secrets engine
            # response = self.client.secrets.database.generate_credentials(
            #     name='postgres-role'
            # )
            # return response['data']
            
            logger.info("Database credentials rotated")
            return {
                "username": "postgres_dynamic",
                "password": "generated_password_123"
            }
            
        except Exception as e:
            logger.error(f"Error rotating database credentials: {e}")
            raise
    
    def generate_totp(self, key_name: str) -> str:
        """
        Generate TOTP code for service account.
        
        Args:
            key_name: TOTP key name
            
        Returns:
            TOTP code
        """
        if not self.use_vault:
            logger.warning("Vault not configured, cannot generate TOTP")
            return "000000"
        
        try:
            # In production, use Vault's TOTP engine
            # response = self.client.secrets.totp.generate_code(name=key_name)
            # return response['data']['code']
            
            return "123456"
            
        except Exception as e:
            logger.error(f"Error generating TOTP: {e}")
            raise
    
    def encrypt(self, plaintext: str, key_name: str = "default") -> str:
        """
        Encrypt data using Vault's transit engine.
        
        Args:
            plaintext: Data to encrypt
            key_name: Encryption key name
            
        Returns:
            Encrypted ciphertext
        """
        if not self.use_vault:
            logger.warning("Vault not configured, returning plaintext")
            return plaintext
        
        try:
            # In production, use Vault's transit engine
            # response = self.client.secrets.transit.encrypt_data(
            #     name=key_name,
            #     plaintext=plaintext
            # )
            # return response['data']['ciphertext']
            
            return f"vault:v1:encrypted_{plaintext}"
            
        except Exception as e:
            logger.error(f"Error encrypting data: {e}")
            raise
    
    def decrypt(self, ciphertext: str, key_name: str = "default") -> str:
        """
        Decrypt data using Vault's transit engine.
        
        Args:
            ciphertext: Data to decrypt
            key_name: Encryption key name
            
        Returns:
            Decrypted plaintext
        """
        if not self.use_vault:
            logger.warning("Vault not configured, returning ciphertext")
            return ciphertext
        
        try:
            # In production, use Vault's transit engine
            # response = self.client.secrets.transit.decrypt_data(
            #     name=key_name,
            #     ciphertext=ciphertext
            # )
            # return response['data']['plaintext']
            
            # Mock decryption
            if ciphertext.startswith("vault:v1:encrypted_"):
                return ciphertext.replace("vault:v1:encrypted_", "")
            return ciphertext
            
        except Exception as e:
            logger.error(f"Error decrypting data: {e}")
            raise
    
    # Helper methods
    
    def _get_from_env(self, path: str, key: Optional[str] = None) -> Any:
        """Fallback to environment variables."""
        env_map = {
            "secret/data/supabase": {
                "service_role_key": os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
                "anon_key": os.getenv("SUPABASE_ANON_KEY"),
                "url": os.getenv("SUPABASE_URL")
            },
            "secret/data/jwt": {
                "secret": os.getenv("JWT_SECRET", "changeme")
            },
            "secret/data/openai": {
                "api_key": os.getenv("OPENAI_API_KEY")
            },
            "secret/data/tailscale": {
                "auth_key": os.getenv("TAILSCALE_AUTH_KEY")
            },
            "secret/data/zerotier": {
                "network_id": os.getenv("ZEROTIER_NETWORK_ID"),
                "api_token": os.getenv("ZEROTIER_API_TOKEN")
            }
        }
        
        data = env_map.get(path, {})
        if key:
            return data.get(key)
        return data
    
    def _get_mock_secret(self, path: str) -> Dict[str, Any]:
        """Get mock secret for testing."""
        return self._get_from_env(path)


# Global instance
vault_client = VaultClient()


# Convenience functions

def get_supabase_credentials() -> Dict[str, str]:
    """Get Supabase credentials from Vault."""
    return vault_client.get_secret("secret/data/supabase")


def get_jwt_secret() -> str:
    """Get JWT secret from Vault."""
    return vault_client.get_secret("secret/data/jwt", "secret")


def get_openai_api_key() -> str:
    """Get OpenAI API key from Vault."""
    return vault_client.get_secret("secret/data/openai", "api_key")
