// TaleSoup Tauri バックエンド
// Sprint 1: 最小構成（フロントエンドのシェルのみ）
// Sprint 2以降: APIクライアント・ファイルI/O・設定管理を追加予定

/// アプリ情報を返すコマンド（サンプル）
#[tauri::command]
fn get_app_info() -> serde_json::Value {
    serde_json::json!({
        "name": "TaleSoup",
        "version": env!("CARGO_PKG_VERSION"),
        "sprint": "Sprint 1"
    })
}

/// フロントエンドから呼べるコマンドを登録する
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_app_info,
            // Sprint 2以降に追加予定:
            // save_story, load_story, list_stories
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
