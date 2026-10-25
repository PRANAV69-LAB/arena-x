package com.arenax.app;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

/**
 * ARENA-X Desktop Main Application Entrypoint.
 * Professional JavaFX 21 UI built with Dark Navy and Neon Emerald theme.
 */
public class ArenaXApp extends Application {

    private BorderPane rootLayout;
    private Label activeModuleTitle;
    private StackPane contentArea;

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("ARENA-X — Intelligent Sports Tournament & SQL Visualization System");

        rootLayout = new BorderPane();
        rootLayout.getStyleClass().add("root");

        // 1. Sidebar Navigation
        VBox sidebar = buildSidebar();
        rootLayout.setLeft(sidebar);

        // 2. Top Header
        HBox header = buildHeader();
        rootLayout.setTop(header);

        // 3. Center Dynamic Content Area
        contentArea = new StackPane();
        contentArea.setPadding(new Insets(24));
        contentArea.getChildren().add(buildDashboardView());
        rootLayout.setCenter(contentArea);

        Scene scene = new Scene(rootLayout, 1380, 860);
        // Load CSS
        try {
            String cssPath = getClass().getResource("/css/arena-x.css").toExternalForm();
            scene.getStylesheets().add(cssPath);
        } catch (Exception ignored) {}

        primaryStage.setScene(scene);
        primaryStage.setMinWidth(1100);
        primaryStage.setMinHeight(700);
        primaryStage.show();
    }

    private HBox buildHeader() {
        HBox header = new HBox(16);
        header.setAlignment(Pos.CENTER_LEFT);
        header.setPadding(new Insets(16, 24, 16, 24));
        header.setStyle("-fx-background-color: #0B1120; -fx-border-color: #1E293B; -fx-border-width: 0 0 1 0;");

        activeModuleTitle = new Label("Tournament Overview & Live Operations");
        activeModuleTitle.setStyle("-fx-font-size: 18px; -fx-font-weight: bold; -fx-text-fill: #F8FAFC;");

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Label dbBadge = new Label("MySQL 8.0: arena_x_db (ONLINE)");
        dbBadge.setStyle("-fx-text-fill: #10B981; -fx-font-size: 12px; -fx-padding: 4 8; -fx-border-color: #10B981; -fx-border-radius: 4px;");

        Label userBadge = new Label("Logged in as: Dr. Marcus Vance [ADMIN]");
        userBadge.setStyle("-fx-text-fill: #94A3B8; -fx-font-size: 13px;");

        header.getChildren().addAll(activeModuleTitle, spacer, dbBadge, userBadge);
        return header;
    }

    private VBox buildSidebar() {
        VBox sidebar = new VBox(8);
        sidebar.setPrefWidth(260);
        sidebar.setPadding(new Insets(20, 16, 20, 16));
        sidebar.getStyleClass().add("sidebar");

        Label brand = new Label("ARENA-X");
        brand.setStyle("-fx-font-size: 24px; -fx-font-weight: 900; -fx-text-fill: #10B981; -fx-letter-spacing: 2px;");
        Label subBrand = new Label("Sports & SQL DBMS Platform");
        subBrand.setStyle("-fx-font-size: 11px; -fx-text-fill: #64748B; -fx-padding: 0 0 16 0;");

        sidebar.getChildren().addAll(brand, subBrand, new Separator());

        String[] modules = {
                "Dashboard", "Tournaments", "Teams", "Players",
                "Fixtures", "Live Scores", "Leaderboards", "Analytics",
                "SQL Explorer", "Settings"
        };

        for (String mod : modules) {
            Button btn = new Button(mod);
            btn.setMaxWidth(Double.MAX_VALUE);
            btn.getStyleClass().add("nav-button");
            if (mod.equals("Dashboard")) btn.getStyleClass().add("nav-button-active");

            btn.setOnAction(e -> {
                activeModuleTitle.setText(mod + " Module");
                contentArea.getChildren().clear();
                if (mod.equals("SQL Explorer")) {
                    contentArea.getChildren().add(buildSqlExplorerPlaceholder());
                } else {
                    contentArea.getChildren().add(buildDashboardView());
                }
            });

            sidebar.getChildren().add(btn);
        }

        return sidebar;
    }

    private Node buildDashboardView() {
        VBox dash = new VBox(20);
        
        // Stat Cards Row
        HBox cards = new HBox(16);
        cards.getChildren().addAll(
                createStatCard("Total Tournaments", "4 Active", "#3B82F6"),
                createStatCard("Registered Teams", "22 Squads", "#10B981"),
                createStatCard("Total Players", "110 Athletes", "#F59E0B"),
                createStatCard("Live Matches", "2 Ongoing", "#EF4444")
        );

        Label recentTitle = new Label("Tournament Matches & Live Scoreboard");
        recentTitle.setStyle("-fx-font-size: 16px; -fx-font-weight: bold; -fx-text-fill: #E2E8F0;");

        dash.getChildren().addAll(cards, recentTitle);
        return dash;
    }

    private VBox createStatCard(String label, String value, String accentColor) {
        VBox card = new VBox(6);
        card.getStyleClass().add("card");
        HBox.setHgrow(card, Priority.ALWAYS);

        Label lbl = new Label(label);
        lbl.getStyleClass().add("card-stat-label");

        Label val = new Label(value);
        val.getStyleClass().add("card-stat-value");
        val.setStyle("-fx-text-fill: " + accentColor + ";");

        card.getChildren().addAll(lbl, val);
        return card;
    }

    private VBox buildSqlExplorerPlaceholder() {
        VBox box = new VBox(16);
        box.getStyleClass().add("card");
        Label title = new Label("SQL Explorer & Logical Execution Pipeline");
        title.setStyle("-fx-font-size: 18px; -fx-font-weight: bold; -fx-text-fill: #10B981;");
        TextArea editor = new TextArea("SELECT t.team_name, count(m.match_id) as games_played\nFROM teams t\nJOIN matches m ON t.team_id = m.team_a_id OR t.team_id = m.team_b_id\nWHERE m.status = 'COMPLETED'\nGROUP BY t.team_name\nORDER BY games_played DESC;");
        editor.getStyleClass().add("sql-editor");
        editor.setPrefRowCount(6);

        Button executeBtn = new Button("Execute Query on MySQL");
        executeBtn.getStyleClass().add("button-primary");

        box.getChildren().addAll(title, editor, executeBtn);
        return box;
    }

    public static void main(String[] args) {
        launch(args);
    }
}
