// Tauriのデスクトップアプリエントリポイント
// Windows でコンソールウィンドウを非表示にする
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    talesoup_lib::run()
}
