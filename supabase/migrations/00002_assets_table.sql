-- ============================================================================
-- ASSETS TABLE - User Trading Pairs/Symbols
-- ============================================================================

-- Type d'actif
CREATE TYPE asset_type AS ENUM ('FOREX', 'CRYPTO', 'STOCK', 'ETF', 'COMMODITY', 'INDEX', 'OTHER');

-- ============================================================================
-- TABLE: assets
-- ============================================================================

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations de l'actif
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100),
    asset_type asset_type NOT NULL DEFAULT 'FOREX',
    
    -- Flags
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Métadonnées
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Contrainte: symbole unique par utilisateur (ou global pour defaults)
    CONSTRAINT unique_asset_per_user UNIQUE (user_id, symbol)
);

-- Index pour les requêtes
CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_assets_symbol ON assets(symbol);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- SELECT: User can see their own assets + default assets (user_id IS NULL)
CREATE POLICY "assets_select_own_and_defaults" ON assets
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

-- INSERT: User can only create their own assets
CREATE POLICY "assets_insert_own" ON assets
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: User can only update their own assets
CREATE POLICY "assets_update_own" ON assets
    FOR UPDATE
    USING (auth.uid() = user_id AND is_default = FALSE)
    WITH CHECK (auth.uid() = user_id);

-- DELETE: User can only delete their own non-default assets
CREATE POLICY "assets_delete_own" ON assets
    FOR DELETE
    USING (auth.uid() = user_id AND is_default = FALSE);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================

CREATE TRIGGER trigger_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED: Default Popular Assets
-- ============================================================================

-- Forex pairs
INSERT INTO assets (user_id, symbol, name, asset_type, is_default) VALUES
    (NULL, 'EURUSD', 'Euro / US Dollar', 'FOREX', TRUE),
    (NULL, 'GBPUSD', 'British Pound / US Dollar', 'FOREX', TRUE),
    (NULL, 'USDJPY', 'US Dollar / Japanese Yen', 'FOREX', TRUE),
    (NULL, 'USDCHF', 'US Dollar / Swiss Franc', 'FOREX', TRUE),
    (NULL, 'AUDUSD', 'Australian Dollar / US Dollar', 'FOREX', TRUE),
    (NULL, 'USDCAD', 'US Dollar / Canadian Dollar', 'FOREX', TRUE),
    (NULL, 'NZDUSD', 'New Zealand Dollar / US Dollar', 'FOREX', TRUE),
    (NULL, 'XAUUSD', 'Gold / US Dollar', 'COMMODITY', TRUE),
    (NULL, 'XAGUSD', 'Silver / US Dollar', 'COMMODITY', TRUE);

-- Crypto
INSERT INTO assets (user_id, symbol, name, asset_type, is_default) VALUES
    (NULL, 'BTCUSDT', 'Bitcoin / Tether', 'CRYPTO', TRUE),
    (NULL, 'ETHUSDT', 'Ethereum / Tether', 'CRYPTO', TRUE),
    (NULL, 'BNBUSDT', 'Binance Coin / Tether', 'CRYPTO', TRUE),
    (NULL, 'SOLUSDT', 'Solana / Tether', 'CRYPTO', TRUE),
    (NULL, 'XRPUSDT', 'Ripple / Tether', 'CRYPTO', TRUE);

-- US Stocks
INSERT INTO assets (user_id, symbol, name, asset_type, is_default) VALUES
    (NULL, 'AAPL', 'Apple Inc.', 'STOCK', TRUE),
    (NULL, 'MSFT', 'Microsoft Corporation', 'STOCK', TRUE),
    (NULL, 'GOOGL', 'Alphabet Inc.', 'STOCK', TRUE),
    (NULL, 'AMZN', 'Amazon.com Inc.', 'STOCK', TRUE),
    (NULL, 'TSLA', 'Tesla Inc.', 'STOCK', TRUE),
    (NULL, 'NVDA', 'NVIDIA Corporation', 'STOCK', TRUE),
    (NULL, 'META', 'Meta Platforms Inc.', 'STOCK', TRUE);

-- ETFs
INSERT INTO assets (user_id, symbol, name, asset_type, is_default) VALUES
    (NULL, 'SPY', 'SPDR S&P 500 ETF', 'ETF', TRUE),
    (NULL, 'QQQ', 'Invesco QQQ Trust', 'ETF', TRUE),
    (NULL, 'IWM', 'iShares Russell 2000 ETF', 'ETF', TRUE),
    (NULL, 'DIA', 'SPDR Dow Jones Industrial Average ETF', 'ETF', TRUE);

-- Indices
INSERT INTO assets (user_id, symbol, name, asset_type, is_default) VALUES
    (NULL, 'US30', 'Dow Jones Industrial Average', 'INDEX', TRUE),
    (NULL, 'US500', 'S&P 500 Index', 'INDEX', TRUE),
    (NULL, 'NAS100', 'NASDAQ 100 Index', 'INDEX', TRUE),
    (NULL, 'GER40', 'DAX 40 Index', 'INDEX', TRUE);

COMMENT ON TABLE assets IS 'Trading assets/pairs with user-created and default options';
